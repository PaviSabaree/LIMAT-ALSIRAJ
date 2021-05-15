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
    
    private getUsers = (req: express.Request, res: express.Response) => {

        const result = this.service.getUsers();
        
        res.send( result );
    }

    private _signup = (req: express.Request, res: express.Response) => {

        try {
            const {userName, firstName, lastName, password, emailId, phoneNumber, appUser, userType, documentUrl}= req.body

            const result = this.service.signUp({userName, firstName, lastName, password, emailId, phoneNumber, appUser, userType, documentUrl});
            
            res.send( result );  
        } catch (error) {
            
            res.status(400).send({
                message: error
             });
        }

       
    }
}

export default HomeRoute