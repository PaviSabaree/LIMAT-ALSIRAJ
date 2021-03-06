import * as express from 'express'
import AuthService from '../../service/auth/auth.service';

class AuthRoute  {

    protected router = express.Router();
    protected authService:AuthService; 
    
    constructor() {
        this.router.post('/masters/any/users/add', this._signup);
        this.router.put('/masters/any/update/user', this._signup);
        this.router.post('/auth/signin', this._signIn);
        this.router.post('/auth/getAuthToken', this._getAuthToken);
        this.router.post('/auth/upload', this._upload);
        this.router.post('/auth/password_reset', this._pwdResetRequest);
        this.router.put('/auth/password_update', this._pwdReset);
        this.authService = new AuthService();

    }
    
    private  _signup = async (req: express.Request, res: express.Response) => {

        try {
            const {userName, firstName, lastName, password, emailId, phoneNumber,
                 appUser, userType, documentUrl, socialAuth}= req.body

            const result = await this.authService.signUp({userName, firstName, lastName, 
                password, emailId, phoneNumber, appUser, userType, documentUrl, socialAuth});   


            if(!result && result === undefined){
                throw new Error('unable to save');
            }
            
            res.json({ data :  result });  
        } catch (err) {
 
            console.log("Error occured in _signup",err);

                res.status(400).json({
                    message: err.toString()
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

            const tokens = await this.authService.getAccessToken(req.body.token);

            if(!tokens && tokens === undefined) {
                throw new Error('unable to get access token');
            }

            const response  ={
                status: true,
                msg: 'new token created successfully',
                refreshtoken:  tokens.refreshToken ,
                token :  tokens.accessToken

            }

            res.json(response);  

        }catch(err){
            console.log("Error occured in _signIn",err);

            res.status(400).json({
                message: err.toString()
            });  
        }
    }

    private  _upload = async (req, res: express.Response) => {

        try {
            
            const result = await this.authService.uploadFileToS3(req);
            
            res.json({ data :  result });  
        } catch (err) {
 
            console.log("Error occured in _upload",err);

                res.status(400).json({
                    message: err
                });  
           
        }
       
    } 
    /** 
     * password reset request initiate 
     */

    private  _pwdResetRequest = async (req: express.Request, res: express.Response) => {

        try {

            const { emailId }= req.body

            const result = await this.authService.pwdResetRequest(emailId);   

            if(!result && result === undefined){
                throw new Error('unable to get details');
            }
            
            res.json({ data :  result });  
        } catch (err) {
 
            console.log("Error occured in _pwdResetRequest",err);

                res.status(400).json({
                    message: err.toString()
                });  
           
        }
       
    }

    /**
     * password reset / update call
     */

    private  _pwdReset = async (req: express.Request, res: express.Response) => {

        try {

            const { userId, password , token
                 }= req.body

            const result = await this.authService.pwdReset({
                userId, password, token});   


            if(!result && result === undefined){
                throw new Error('unable to get details');
            }
            
            res.json({ data :  result });  
        } catch (err) {
 
            console.log("Error occured in _pwdReset",err);

                res.status(400).json({
                    message: err.toString()
                });  
           
        }
       
    }
}

export default AuthRoute