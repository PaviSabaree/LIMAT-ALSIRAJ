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
        documentUrl: string,
        socialAuth?: boolean
    
}


export interface IRequestExtended extends Request{
       user : ILoginInfo
}

export interface ILoginInfo{
        emailId: string,
        password: string,
        userName?: string,
        userType?: string
   
}

export interface IEmailInfo{
        emailId: string,
        subject: string,
        emailBody: string
   
}