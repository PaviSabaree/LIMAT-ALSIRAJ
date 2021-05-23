import { IEvents } from "../../interfaces/i-event";
import { Events } from "../../schema/events/events.schema";

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

    public async getEvents():Promise<any> {
        try {
            
            return await Events.find().exec();
        }catch(err){
            console.debug("Error occured in getEvents");
            throw err;
        }
    }

}

export default EventService