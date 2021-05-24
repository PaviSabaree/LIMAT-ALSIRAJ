import { IApplyEvent } from "../../interfaces/i-member-skills";
import { ILoginInfo } from "../../interfaces/IUser.interface";
import { Participations } from "../../schema/participations/participations.schema";

class ParticipationsService {

    public async applyEvent(userInformation: IApplyEvent):Promise<any> {
        try {
            const participants = new Participations({
                userName: userInformation.userName,
                userId: userInformation.userId,
                eventId: userInformation.eventId,
                emailId: userInformation.emailId,
                status: 'Pending'
            });

            return await participants.save();
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
}

export default ParticipationsService

