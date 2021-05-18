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
        
        res.json(result);  
    }
}

export default HomeRoute

function Router() {
    throw new Error('Function not implemented.');
}
