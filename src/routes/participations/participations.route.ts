

import * as express from 'express'
import { IRequestExtended } from '../../interfaces/IUser.interface';
import authenticateToken from '../../middleware/authentication';
import ParticipationsService from '../../service/participations/participations.service';




class ParticipationsRoute {

    protected router = express.Router();
    protected service:ParticipationsService; 
    
    constructor() {
        this.router.post('/masters/any/userparticipant/add', authenticateToken, this._applyEvent);
        this.router.get('/masters/any/userparticipant/list', authenticateToken, this._getParticipantsList);
        this.router.put('/masters/any/userparticipant/:id/:value', authenticateToken, this._approveParticipant);
        this.router.delete('/masters/any/userparticipant/delete/:id', authenticateToken, this._deleteParticipant);

        this.service = new ParticipationsService();

    }
    
    private  _applyEvent = async (req: express.Request, res: express.Response, next) => {

        try {

            const participants = await this.service.applyEvent(req.body);
            
            if(!participants && participants === undefined){
                throw new Error('unable to save member skill set');
            }

            const response = {
                status : 200,
                message: `SucessFully apply for event Id = ${req.body.eventId} and participantId = ${participants._id}` 
            }
            
            res.json({ data :  response });   
        } catch (err) {
             console.log("MemberSkillRoute: Error occured in _applyEvent",err);

                res.status(400).json({
                    message: err.toString()
                }); 
        }

    }

    private  _getParticipantsList = async (req: IRequestExtended, res: express.Response, next) => {

        try {

            const participants = await this.service.getParticipant(req.query.userId? req.query.userId.toString(): undefined, req.user);
            
            if(!participants && participants === undefined){
                throw new Error('unable to save member skill set');
            }


            res.json({ data :  participants });   
        } catch (err) {
             console.log("MemberSkillRoute: Error occured in _applyEvent",err);

                res.status(400).json({
                    message: err.toString()
                }); 
        }

    }

    private  _approveParticipant = async (req: IRequestExtended, res: express.Response, next) => {

        try {

            const approveParticipants = await this.service.approveParticipant(req.params.id, req.params.value);
            
            if(!approveParticipants && approveParticipants === undefined){
                throw new Error('unable to save member skill set');
            }


            const response = {
                status : 200,
                message: `SucessFully approved/rejected the participant` 
            }

            res.json({ data :  response });   
        } catch (err) {
             console.log("MemberSkillRoute: Error occured in _applyEvent",err);

                res.status(400).json({
                    message: err.toString()
                }); 
        }

    }

    private  _deleteParticipant = async (req: IRequestExtended, res: express.Response, next) => {

        try {

            const deleteParticipants = await this.service.deleteParticipant(req.params.id);
            
            if(!deleteParticipants && deleteParticipants === undefined){
                throw new Error('unable to save member skill set');
            }


            const response = {
                status : 200,
                message: `Deleted the participant` 
            }

            res.json({ data :  response });   
        } catch (err) {
             console.log("MemberSkillRoute: Error occured in _deleteParticipant",err);

                res.status(400).json({
                    message: err.toString()
                }); 
        }

    }

}

export default ParticipationsRoute

function Router() {
    throw new Error('Function not implemented.');
}
