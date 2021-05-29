require('dotenv').config()
import * as jwt from "jsonwebtoken";
import * as bcrypt from 'bcrypt'
import {s3upload} from "../s3upload"
import { ILoginInfo, IUserInformation } from "../../interfaces/IUser.interface";
import { UserSchema } from "../../schema/user.schema";

class AuthService {
    
    protected refreshTokens = [];
  /* function to create new User */
  public async signUp(userInformation: IUserInformation): Promise<any> {
    try {

      const checkExistingUser = await this._checkExistinguser(userInformation)

      console.log('db user value ==', checkExistingUser)

      if(checkExistingUser){
        if(userInformation.socialAuth){

          return checkExistingUser
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
          socialAuth: userInformation.socialAuth? true : false
        });

        const result = await user.save();

        const tokenInfo : ILoginInfo = {
          emailId: userInformation.emailId,
          password: userInformation.password,
          userType: userInformation.userType,
        }

        const token = await this._generateAccessToken(tokenInfo);
        const refreshtoken = await this._generateRefreshToken(tokenInfo);
  
        return {
          result,
          data: {
            status: true,
            token,
            refreshtoken,
          }
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

        const passwordValidation = await this._isValidPassword( userDbInfo[0].password, user.password)

        user.userType = userDbInfo[0]['userType']

        if(!passwordValidation){
          throw new Error('Given password is wrong please check you passwod')
        }

        if(userDbInfo.length){

          const token = await this._generateAccessToken(user);
          const refreshtoken = await this._generateRefreshToken(user);

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
            userDbInfo:userDbInfo[0]
          }
        }else{

          throw new Error('User Not found, Please signUp or please check your mail')
        }

      } catch (err) {
        console.log("Exception occured in signIn", err);
  
        throw err
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


    private async _checkExistinguser(userInformation: IUserInformation) {
     
      const dbResponse = await UserSchema.findOne({'emailId': userInformation.emailId}).exec()

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
