import * as express from 'express'
import { IRequestExtended } from '../../interfaces/IUser.interface';
import authenticateToken from '../../middleware/authentication';
import MemberSkillService from '../../service/skills/member-skill.service';



class MemberSkillRoute  {

    protected router = express.Router();
    protected skillService:MemberSkillService; 
    
    constructor() {
        this.router.post('/member/skill', this.addMemberSkillSet);
        this.router.get('/member/skill/list', this.getMemberSkillSet);
        this.router.put('/member/skill/edit', this.editMemberSkillSet);
        this.router.delete('/member/skill/delete/:id', this.deleteMemberSkillSet);

        this.skillService = new MemberSkillService();

    }
    
    private  addMemberSkillSet = async (req: express.Request, res: express.Response, next) => {

        try {

            const skillSaveResult = await this.skillService.addMemberSkillSet(req.body);
            
            if(!skillSaveResult && skillSaveResult === undefined){
                throw new Error('unable to save member skill set');
            }
            
            res.json({ data :  skillSaveResult });   
        } catch (err) {
             console.log("MemberSkillRoute: Error occured in addMemberSkillSet",err);

                res.status(400).json({
                    message: err.toString()
                }); 
        }

    }

    private  getMemberSkillSet = async (req: IRequestExtended, res: express.Response, next) => {

        try {
            let userId;

            if(req.query && req.query.userId){
                userId = req.query.userId;
            }else {
                throw new Error('Bad Request, User Id required to process');
            }
            

            const skillSaveResultArray = await this.skillService.getMemberSkillList(userId);
          
            res.json({ data :  skillSaveResultArray });    
        } catch (err) {
             console.log("Error occured in getting admin list",err);

                res.status(400).json({
                    message: err.toString()
                }); 
        }

    }

    private  editMemberSkillSet = async (req: IRequestExtended, res: express.Response, next) => {

        try {
            const skillSaveResultObject = await this.skillService.editMemberSkillSet(req.body);
          
            if(!skillSaveResultObject && skillSaveResultObject === undefined){
                throw new Error('unable to update member skill set');
            }
            
            res.json({ data :  skillSaveResultObject });  
        } catch (err) {
             console.log("Error occured in getting admin list",err);

                res.status(400).json({
                    message: err.toString()
                }); 
        }

    }

    private  deleteMemberSkillSet = async (req: IRequestExtended, res: express.Response, next) => {

        try {
            const result = await this.skillService.deleteMemberSkillSet(req.params.id);
          
            res.json({ data :  result });  
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
