export interface IUserInformation{

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

export interface ILoginInfo{
        emailId: string,
        password: string,
        userName?: string,
   
}