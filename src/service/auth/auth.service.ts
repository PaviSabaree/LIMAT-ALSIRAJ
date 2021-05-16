import { IUserInformation } from "interfaces/IUser.interface";
import * as jwt from "jsonwebtoken";
import { UserSchema } from "schema/user.schema";

class AuthService {
    
    protected refreshTokens = [];
  /* function to create new User */
  public async signUp(userInformation: IUserInformation): Promise<any> {
    try {
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
      });

      return await user.save();
    } catch (err) {
      console.log("Exception occured in signUp", err);

      throw err
    }
  }

    /* function to Login and get accessToken and RefreshToken */
    public async signIn(userInformation: any): Promise<any> {
      try {
       
        const user = {
          userName: userInformation.userName,
          emailId: userInformation.emailId
        }

        const userDbInfo = await UserSchema.find({'emailId': userInformation.emailId}).exec()

        if(userDbInfo.length){

          const token = await this._generateRefreshToken(user);
          const refreshtoken = await this._generateAccessToken(user);

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
            userDbInfo
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
        try {
            let accessToken = '';

            if (token == null && !this.refreshTokens.includes(token)){
                throw new Error('not a valid token');
            } 
 
            jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
              if (err){
                throw err;
              } 
            
              accessToken = this._generateAccessToken({ name: user.name })
            })

            return accessToken;
        }catch(err){
            console.log("Exception occured in getAccessToken", err);
  
            throw err;
        }
    }

  private async _generateAccessToken(user): Promise<string> {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
  }

  private async _generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30m' })
  }
}

export default AuthService;
