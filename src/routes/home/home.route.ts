import * as express from 'express'
import Service from '../../service/service';

class HomeRoute  {

    protected router = express.Router();
    protected service:Service; 
    
    constructor() {
        this.router.get('/', this.getUsers);
        this.router.post('/masters/any/users/add', this._signup);
        this.service = new Service();

    }
    
    private getUsers = (req: express.Request, res: express.Response,next) => {

        const result = this.service.getUsers();

        console.log(result)
        
        res.send( result );
    }

    private  _signup = async (req: express.Request, res: express.Response) => {

        try {
            const {userName, firstName, lastName, password, emailId, phoneNumber,
                 appUser, userType, documentUrl}= req.body

            const result = await this.service.signUp({userName, firstName, lastName, 
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
}

export default HomeRoute