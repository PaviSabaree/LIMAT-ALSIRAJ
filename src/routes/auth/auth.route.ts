import * as express from 'express'
import AuthService from '../../service/auth/auth.service';

class AuthRoute  {

    protected router = express.Router();
    protected authService:AuthService; 
    
    constructor() {
        this.router.post('/masters/any/users/add', this._signup);
        this.router.post('/auth/signin', this._signIn);
        this.router.post('/auth/getAuthToken', this._getAuthToken);
        this.router.post('/auth/upload', this._upload);
        this.authService = new AuthService();

    }
    
    private  _signup = async (req: express.Request, res: express.Response) => {

        try {
            const {userName, firstName, lastName, password, emailId, phoneNumber,
                 appUser, userType, documentUrl}= req.body

            const result = await this.authService.signUp({userName, firstName, lastName, 
                password, emailId, phoneNumber, appUser, userType, documentUrl});   


            if(!result && result === undefined){
                throw new Error('unable to save');
            }
            
            res.json({ data :  result });  
        } catch (err) {
 
            console.log("Error occured in _signup",err);

                res.status(400).json({
                    message: err
                });  
           
        }
       
    }

    private  _signIn = async (req: express.Request, res: express.Response) => {

        try {

            const { emailId, password
                 }= req.body

            const result = await this.authService.signIn({
                password, emailId});   


            if(!result && result === undefined){
                throw new Error('unable to get details');
            }
            
            res.json({ data :  result });  
        } catch (err) {
 
            console.log("Error occured in _signIn",err);

                res.status(400).json({
                    message: err.toString()
                });  
           
        }
       
    }

    private _getAuthToken = async (req: express.Request, res: express.Response) => {
        try {

            const accessToken = await this.authService.getAccessToken(req.body.token);

            if(!accessToken && accessToken === undefined) {
                throw new Error('unable to get access token');
            }

            res.json({ accessToken :  accessToken });  

        }catch(err){
            console.log("Error occured in _signIn",err);

            res.status(400).json({
                message: err.toString()
            });  
        }
    }

    private  _upload = async (req: express.Request, res: express.Response) => {

        try {
            
            const result = await this.authService.uploadFileToS3(req);
            
            res.json({ data :  result });  
        } catch (err) {
 
            console.log("Error occured in _signup",err);

                res.status(400).json({
                    message: err
                });  
           
        }
       
    }
}

export default AuthRoute