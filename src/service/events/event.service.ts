import { IEvents } from "../../interfaces/i-event";
import { Events } from "../../schema/events/events.schema";
import { Participations } from "../../schema/participations/participations.schema";

class EventService {

    public async addEvent(eventInfo: IEvents):Promise<any> {
        try {
            const event = new Events({
                competitionName: eventInfo.competitionName,
                type:  eventInfo.type,
                status: eventInfo.status,
                startDate:  eventInfo.startDate,
                endDate:  eventInfo.endDate,
                description:  eventInfo.description,
                documentUrl:  eventInfo.documentUrl,
            });

            return await event.save();
        }catch(err){
            console.debug("Error occured in addEvent");
            throw err;
        }
    }

    public async editEvent(eventInfo: IEvents, id: string):Promise<any> {
        try {

            return await Events.findOneAndUpdate(
                    {'_id': id},
                    {
                        $set: {
                            'competitionName': eventInfo.competitionName,
                            'type': eventInfo.type,
                            'status': eventInfo.status,
                            'startDate': eventInfo.startDate,
                            'endDate': eventInfo.endDate,
                            'description':  eventInfo.description,
                            'documentUrl': eventInfo.documentUrl
                        }
                    }
                ).exec();        
            
        }catch(err){
            console.debug("Error occured in editEvent");
            throw err;
        }
    }

    public async deleteEvent(eventId: string):Promise<any> {
        try {
            
            return await Events.findOneAndDelete({"_id" : eventId }).exec();
        }catch(err){
            console.debug("Error occured in deleteEvent");
            throw err;
        }
    }

    public async getEvents(userId):Promise<any> {
        try {
            const events : any = await Events.find().exec();

            const newEvents = JSON.parse(JSON.stringify(events))

            if(userId){
                const listAlreadyParticipated = await Participations.find({ 'userId': userId }).populate('eventInfo').exec();
                newEvents.forEach(element => {

                    listAlreadyParticipated.forEach(ele => {
                        if(ele['eventId'].toString()=== element['_id'].toString()){
                            element.isAlreadyApplied = true
                        }
                    });
                  
                });

            }       

            return newEvents
        }catch(err){
            console.debug("Error occured in getEvents");
            throw err;
        }
    }

  

}

export default EventService