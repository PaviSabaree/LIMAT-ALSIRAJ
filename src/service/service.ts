import { IUserInformation } from "interfaces/IUser.interface";
import { IGetUsers } from "models/i-get-user";
import { UserSchema } from "../schema/user.schema";
import * as jwt from "jsonwebtoken";

class Service {
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

          const token = await this.generateRefreshToken(user);
          const refreshtoken = await this.generateAccessToken(user)
  
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

  private async generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
  }

  private async generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30m' })
  }
  public async getUsers(): Promise<IGetUsers[]> {
    return [
      {
        id: 1,
        name: "Rakesh",
      },
      {
        id: 2,
        name: "Venkat",
      },
      {
        id: 3,
        name: "Asharaf",
      },
    ];
  }
}

export default Service;
