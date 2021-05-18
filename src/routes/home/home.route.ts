import * as express from 'express'
import authenticateToken from '../../middleware/authentication';
import Service from '../../service/service';

class HomeRoute  {

    protected router = express.Router();
    protected service:Service; 
    
    constructor() {
        this.router.get('/test', authenticateToken, this.getUsers);
        this.service = new Service();

    }
    
    private getUsers = async (req: express.Request, res: express.Response,next) => {

        const result =await this.service.getUsers();

        console.log(result)
        
        res.send( result );
    }
}

export default HomeRoute