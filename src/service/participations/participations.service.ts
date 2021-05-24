import { IApplyEvent } from "../../interfaces/i-member-skills";
import { ILoginInfo } from "../../interfaces/IUser.interface";
import { Participations } from "../../schema/participations/participations.schema";

class ParticipationsService {

    public async applyEvent(userInformation: IApplyEvent):Promise<any> {
        try {

            const checkAlreadyApplied = await this._isUserAlreadyAppliedForevent(
                userInformation.userId, userInformation.eventId)

                if(!checkAlreadyApplied){
                    const participants = new Participations({
                        userName: userInformation.userName,
                        userId: userInformation.userId,
                        eventId: userInformation.eventId,
                        emailId: userInformation.emailId,
                        status: 'Pending'
                    });
        
                    return await participants.save();
                }

                throw new Error('You Already apply for this event, Please edit or apply for new Event')

          
        }catch(err){
            console.debug("Error occured in applyEvent");
            throw err;
        }
    }

    public async getParticipant(userId: string | undefined, userInfo: ILoginInfo):Promise<any> {
        try {
            
            if(userId){
                return await Participations.find({'userId': userId}).exec();
            }else{
               if( userInfo.userType === 'admin'){
                   return await Participations.find().exec()
               }

               throw new Error('You are not allow to see all participant details')
            }
        }catch(err){
            console.debug("Error occured in getParticipant");
            throw err;
        }
    }

    public async approveParticipant(participantId: string , value: string):Promise<any> {
        try {
            
            return await Participations.findOneAndUpdate(
                {'_id': participantId},
                {
                    $set: {
                        'status': value
                    }
                }
            ).exec();       
            
        }catch(err){
            console.debug("Error occured in approveParticipant");
            throw err;
        }
    }
    public async deleteParticipant(participantId: string ):Promise<any> {
        try {
            
            return await Participations.findOneAndDelete({"_id" : participantId }).exec();       
            
        }catch(err){
            console.debug("Error occured in approveParticipant");
            throw err;
        }
    }

    private async _isUserAlreadyAppliedForevent(userId: string, eventId: string):Promise<boolean> {
        try {

            const dbResponse = await Participations.findOne({'userId': userId}).exec();
            console.log('dbResponse ===', dbResponse, eventId, userId )
            if(dbResponse && dbResponse['eventId'] === eventId){

                return true
            }
            
            return false
        }catch(err){
            console.debug("Error occured in getEvents");
            throw err;
        }
    }
}

export default ParticipationsService

