import { Request } from 'express';
export interface IUserInformation {

        userName: string,
        firstName: string,
        lastName: string,
        password: string,
        emailId: string,
        phoneNumber: number,
        appUser: string,
        userType: string,
        documentUrl: string
    
}


export interface IRequestExtended extends Request{
       user : any
}

export interface ILoginInfo{
        emailId: string,
        password: string,
        userName?: string,
        userType?: string
   
}