import * as express from 'express'
import authenticateToken from 'middleware/authentication';
import Service from '../../service/service';

class HomeRoute  {

    protected router = express.Router();
    protected service:Service; 
    
    constructor() {
        this.router.get('/', authenticateToken, this.getUsers);
        this.service = new Service();

    }
    
    private getUsers = (req: express.Request, res: express.Response,next) => {

        const result = this.service.getUsers();

        console.log(result)
        
        res.send( result );
    }
}

export default HomeRoute