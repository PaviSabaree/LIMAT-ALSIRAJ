import { IUserInformation } from "interfaces/IUser.interface";
import { IGetUsers } from "models/i-get-user";
import { UserSchema } from "../schema/user.schema"

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
                documentUrl: userInformation.documentUrl

            })

            await user.save().then((data: any) => {
                return data
            })
        } catch (error) {

            console.error('Exception occured in signUp', error)

            throw error
        }

    }

    public async getUsers(): Promise<IGetUsers[]> {

        return [
            {
                id: 1,
                name: 'Rakesh'
            },
            {
                id: 2,
                name: 'Venkat'
            },
            {
                id: 3,
                name: 'Asharaf'
            }
        ];
    }
}

export default Service;