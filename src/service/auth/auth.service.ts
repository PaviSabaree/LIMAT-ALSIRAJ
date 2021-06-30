require('dotenv').config()
import * as jwt from "jsonwebtoken";
import * as bcrypt from 'bcrypt'
import {s3upload} from "../s3upload"
import { ILoginInfo, IUserInformation } from "../../interfaces/IUser.interface";
import { UserSchema } from "../../schema/user.schema";
import EmailService from "../send.mail";
import { reqResetPwd } from "../../templates/request-reset-password.html";
import { resetPwdSucces } from "../../templates/reset-password.html";
import { ClienUrl } from "../../config/constant.enum"
import { MemberSubscriptions } from "../../schema/member-subscription.schema";

class AuthService {

  private mailService : EmailService;
  protected refreshTokens = [];

  constructor(){
    this.mailService = new EmailService();
  }

  /* function to create new User */
  public async signUp(userInformation: IUserInformation): Promise<any> {
    try {

      const checkExistingUser = await this._checkExistinguser(userInformation.emailId)

      const tokenInfo : ILoginInfo = {
        emailId: userInformation.emailId,
        password: userInformation.password,
        userType: userInformation.userType,
      }

      const token = await this._generateAccessToken(tokenInfo);
      const refreshtoken = await this._generateRefreshToken(tokenInfo);

      console.log('db user value ==', checkExistingUser)


      if(checkExistingUser){
        if(userInformation.socialAuth && userInformation.userType){

          const dbResponse = await UserSchema.findOneAndUpdate({'emailId': userInformation.emailId},
          {
            $set: {
                'userType': userInformation.userType
            }
        }).exec()

        return {
          'checkExistingUser': dbResponse,
          data: {
            status: true,
            token,
            refreshtoken,
          }
        }

        }
        if(userInformation.socialAuth){
          return {
            checkExistingUser,
            data: {
              status: true,
              token,
              refreshtoken,
            }
          }
        }else{
          throw new Error('User Already Exist with this mail Id, Please user different user or use forget passoword')
        }
      }else{
        const user = new UserSchema({
          userName: userInformation.userName,
          firstName: userInformation.firstName,
          lastName: userInformation.lastName,
          password: userInformation.password,
          emailId: userInformation.emailId,
          phoneNumber: userInformation.phoneNumber,
          appUser: userInformation.appUser,
          userType: userInformation.userType,
          documentUrl: userInformation.documentUrl,
          isPaidMember: false,
          socialAuth: userInformation.socialAuth? true : false
        });

        const result = await user.save();

        if(userInformation.socialAuth){

    
          return {
            result,
            data: {
              status: true,
              token,
              refreshtoken,
            }
          }
        }else{
          return result
        }
        }




    } catch (err) {
      console.log("Exception occured in signUp", err);

      throw err
    }
  }



    /* function to Login and get accessToken and RefreshToken */
    public async signIn(userInformation: ILoginInfo): Promise<any> {
      try {
       
        const user : ILoginInfo = {
          emailId: userInformation.emailId,
          password: userInformation.password,
        }
        const userDbInfo = await UserSchema.find({'emailId': userInformation.emailId}).exec();

        console.log('userDbInfo', userDbInfo)

        const passwordValidation = await this._isValidPassword( userDbInfo[0].password, user.password)

        user.userType = userDbInfo[0]['userType']

        if(!passwordValidation){
          throw new Error('Given password is wrong please check you passwod')
        }

        if(userDbInfo.length){

          const token = await this._generateAccessToken(user);
          const refreshtoken = await this._generateRefreshToken(user);
          const subscriptionInfo = await this.getMemberSubscriptionsByUserId(userDbInfo[0]._id);

          this.refreshTokens.push(refreshtoken);
  
          return {
            status: true,
            message: "Signin Successfully.",
            data: {
              status: true,
              token,
              refreshtoken,
            },
            userType: userDbInfo[0]['userType'],
            userDbInfo:userDbInfo[0],
            subscriptionInfo: subscriptionInfo
          }
        }else{

          throw new Error('User Not found, Please signUp or please check your mail')
        }

      } catch (err) {
        console.log("Exception occured in signIn", err);
  
        throw err
      }
    }

    public async getMemberSubscriptionsByUserId(userId: string): Promise<any> {
      try {

          return await MemberSubscriptions.findOne({'userId': userId}).exec();
      } catch (err) {
          console.debug("Error occured in getEvents");
          throw err;
      }
  }

    public async getAccessToken(token: string): Promise<any> {

      return new Promise((resolve, reject)=> { 

        let accessToken = '';
        let refreshToken = ''

        if (token == null && !this.refreshTokens.includes(token)){
            throw new Error('not a valid token');
        } 

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user : ILoginInfo) => {
          if (err){
            
            reject(err)
          } 
    
          accessToken = await this._generateAccessToken( {
            emailId: user.emailId,
            password:user.password,
            userType:user.userType
          })

          refreshToken=  await this._generateRefreshToken({
            emailId: user.emailId,
            password:user.password,
            userType:user.userType
          });

          resolve({accessToken, refreshToken})
        })
      })
    }

    public async uploadFileToS3(req: any): Promise<any> {

      return new Promise((resolve, reject)=> { 

        var dateObj = new Date().toLocaleDateString().split('/');
        var filename = "userupload/" + dateObj.join('') + "/" + req.files[0].originalname;
        var s3upl = s3upload(filename,req);
    
        s3upl.then(async function (result) {

            if (result && result['status']) {

              resolve({ "status": true, "message": "succesfully uploaded", filePath: result['filePath'] })
            }
            else {
              resolve({ "status": true, "message": "succesfully uploaded", filePath: "" });
            }
        }).catch((error)=>{
          console.log('Error while uploading the file');

          reject(error)
        })
          

        })
    } 

    public async pwdResetRequest(emailId: string): Promise<any> {
      try {       

        const userInfo = await this._checkExistinguser(emailId);      

        if(!userInfo){
          throw new Error('User does not exist');
        }
        const tokenInfo : ILoginInfo = {
          emailId: userInfo.emailId,
          password: userInfo.password,
          userType: userInfo.userType,
        }

          const resetToken = await this._generateAccessToken(tokenInfo);

          const link = `${ClienUrl.clientURL}/passwordReset?token=${resetToken}&id=${userInfo._id}`;

          let bodyContent: string = reqResetPwd;

          bodyContent = bodyContent.toString().replace('_name',userInfo.userName).replace('_link', link);

          console.log(bodyContent)

          const mailOption = {
            to: emailId,
            subject: "Password Reset Request",
            html: bodyContent
           }

          return this.mailService.sendMail(mailOption);
        

        
      } catch (err) {
        console.log("Exception occured in pwdResetRequest", err);
  
        throw err
      }
    }

    public async pwdReset(pwdRequest): Promise<any> {
      try{

        const isValid = await this._verifyToken(pwdRequest.token);

        if (!isValid) {
          throw new Error("Invalid or expired token");
        }

        const salt = await bcrypt.genSalt(5);
        const hashPassword = await bcrypt.hash(pwdRequest.password, salt);

      await UserSchema.updateOne(
          { _id: pwdRequest.userId },
          { $set: { password: hashPassword } },
          { new: true }
        );

      const user = await UserSchema.findById({ _id: pwdRequest.userId });

      let bodyContent:string = resetPwdSucces;

      bodyContent = bodyContent.toString().replace('_name', user.userName);


      const mailOption = {
        to: user.emailId,
        subject: "Password Reset Successfully",
        html: bodyContent
       }

       return await this.mailService.sendMail(mailOption);

      } catch(error){
        console.log("Exception occured in pwdReset", error);
  
        throw error
      }
    }

    private async _verifyToken(token: string): Promise<boolean> {
      let isValidToken = false;

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, user: any) => {
        if(err){
          throw err;
        }
        isValidToken = true;
      });

      return isValidToken;
    }

    private async _checkExistinguser(emailId: string) {
     
      const dbResponse = await UserSchema.findOne({'emailId': emailId}).exec()

      console.log(dbResponse)

      return dbResponse
    }

  private async _generateAccessToken(user) {
    console.log('qq', user);
    
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
  }

  private async _generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30m' })
  }

  private async _isValidPassword(hashPassword, inputPassword){
    try {
      return await bcrypt.compare(inputPassword, hashPassword)
    } catch (error) {
      throw error
    }
  }
}

export default AuthService;
