import * as express from 'express'
import { IRequestExtended } from '../../interfaces/IUser.interface';
import authenticateToken from '../../middleware/authentication';
import Service from '../../service/service';


class HomeRoute  {

    protected router = express.Router();
    protected service:Service; 
    
    constructor() {
        this.router.get('/masters/any/users/list', authenticateToken, this.getUsers);
        this.router.get('/masters/any/admin/list', authenticateToken, this.getAdmins);
        this.router.post('/masters/any/email/add', authenticateToken, this._sendMail)
        this.service = new Service();

    }
    
    private  getUsers = async (req: express.Request, res: express.Response, next) => {

        try {

            const result =await this.service.getUsers();
            
            res.json(result);   
        } catch (err) {
             console.log("Error occured in getting user list",err);

                res.status(400).json({
                    message: err.toString()
                }); 
        }

    }

    private  getAdmins = async (req: IRequestExtended, res: express.Response, next) => {

        try {
            const result =await this.service.getAdmins(req.user);
          
            res.json(result);   
        } catch (err) {
             console.log("Error occured in getting admin list",err);

                res.status(400).json({
                    message: err.toString()
                }); 
        }

    }

    private  _sendMail = async (req: IRequestExtended, res: express.Response, next) => {

        try {
            await this.service.sendMail(req.body);

            const response = {
                status : 200,
                message: `SucessFully sent mail to ${req.body.emailId}` 
            }
          
            res.json(response);   
        } catch (err) {
             console.log("Error occured in getting admin list",err);

                res.status(400).json({
                    message: err.toString()
                }); 
        }

    }
}

export default HomeRoute

function Router() {
    throw new Error('Function not implemented.');
}
