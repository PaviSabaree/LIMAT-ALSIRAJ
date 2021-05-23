import * as express from 'express'
import { IRequestExtended } from '../../interfaces/IUser.interface';
import authenticateToken from '../../middleware/authentication';
import MemberSkillService from '../../service/skills/member-skill.service';



class MemberSkillRoute  {

    protected router = express.Router();
    protected skillService:MemberSkillService; 
    
    constructor() {
        this.router.post('/masters/any/skills/add', authenticateToken, this._addMemberSkillSet);
        this.router.get('/masters/any/skills/list', authenticateToken, this._getMemberSkillSet);
        this.router.put('/masters/any/skills/edit/:id', authenticateToken, this._editMemberSkillSet);
        this.router.delete('/masters/any/skills/delete/:id',authenticateToken, this._deleteMemberSkillSet);

        this.skillService = new MemberSkillService();

    }
    
    private  _addMemberSkillSet = async (req: express.Request, res: express.Response, next) => {

        try {

            const skillSaveResult = await this.skillService.addMemberSkillSet(req.body);
            
            if(!skillSaveResult && skillSaveResult === undefined){
                throw new Error('unable to save member skill set');
            }

            const response = {
                status : 200,
                message: `Skills created sucessfully and id = ${skillSaveResult._id}` 
            }
            
            res.json({ data :  response });   
        } catch (err) {
             console.log("MemberSkillRoute: Error occured in addMemberSkillSet",err);

                res.status(400).json({
                    message: err.toString()
                }); 
        }

    }

    private  _getMemberSkillSet = async (req: IRequestExtended, res: express.Response, next) => {

        try {
            let userId;

            if(req.query && req.query.userId){
                userId = req.query.userId;
            }
            

            const skillSaveResultArray = await this.skillService.getMemberSkillList(userId, req.user);
          
            res.json({ data :  skillSaveResultArray });    
        } catch (err) {
             console.log("Error occured in getting admin list",err);

                res.status(400).json({
                    message: err.toString()
                }); 
        }

    }

    private  _editMemberSkillSet = async (req: IRequestExtended, res: express.Response, next) => {

        try {
            const skillSaveResultObject = await this.skillService.editMemberSkillSet(req.body, req.params.id);
          
            if(!skillSaveResultObject && skillSaveResultObject === undefined){
                throw new Error('unable to update member skill set');
            }

            const response = {
                status : 200,
                message: `Skills updated sucessfully and id = ${skillSaveResultObject._id}` 
            }
            
            res.json({ data :  response });  
        } catch (err) {
             console.log("Error occured in getting admin list",err);

                res.status(400).json({
                    message: err.toString()
                }); 
        }

    }

    private  _deleteMemberSkillSet = async (req: IRequestExtended, res: express.Response, next) => {

        try {
            const result = await this.skillService.deleteMemberSkillSet(req.params.id);
          

            if(!result && result === undefined){
                throw new Error('unable to delete event');
            }

            const response = {
                status : 200,
                message: `Skill deleted sucessfully and id = ${result._id}` 
            }

            res.json({ data :  response });  
        } catch (err) {
             console.log("Error occured in getting admin list",err);

                res.status(400).json({
                    message: err.toString()
                }); 
        }

    }
}

export default MemberSkillRoute

function Router() {
    throw new Error('Function not implemented.');
}
