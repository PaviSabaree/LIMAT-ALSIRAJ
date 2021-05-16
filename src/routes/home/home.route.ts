import { Request , Response, NextFunction, Router } from 'express';
import authenticateToken from '../../middleware/authentication';
import Service from '../../service/service';

class HomeRoute  {

    protected router = Router();
    protected service:Service; 
    
    constructor() {
        this.router.get('/', [authenticateToken], this.getUsers);
        this.service = new Service();

    }
    
    private getUsers = (req: Request, res: Response,next: NextFunction) => {

        const result = this.service.getUsers();

        console.log(result)
        
        res.json(result);  
    }
}

export default HomeRoute