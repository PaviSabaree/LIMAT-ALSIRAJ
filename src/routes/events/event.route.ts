import * as express from "express";
import authenticateToken from "../../middleware/authentication";
import EventService from "../../service/events/event.service";


class EventRoutes {
    protected router = express.Router();
    protected service: EventService;
    constructor( ){
        this.router.post('/masters/any/competition/add', authenticateToken,this._addEvent);
        this.router.put('/masters/any/competition/edit/:id',authenticateToken, this._editEvent);
        this.router.delete('/masters/any/competition/delete/:id', authenticateToken,this._deleteEvent);
        this.router.get('/masters/any/competition/list',authenticateToken, this._getEvents);
        this.service = new EventService()

    }

    private _addEvent = async (req: express.Request, res: express.Response) => {
        try {
            const eventsResult = await this.service.addEvent(req.body);
            
            if(!eventsResult && eventsResult === undefined){
                throw new Error('unable to save event');
            }

            const response = {
                status : 200,
                message: `Event created sucessfully and id = ${eventsResult._id}` 
            }
            
            res.json({ data :  response }); 
        } catch (error) {
            
            console.log("EventRoute: Error occured in addEventroure",error);

            res.status(400).json({
                message: error.toString()
            }); 
        }
    }

    private _editEvent = async (req: express.Request, res: express.Response) => {
        try {
            const eventsResult = await this.service.editEvent(req.body, req.params.id);
            
            if(!eventsResult && eventsResult === undefined){
                throw new Error('unable to update event');
            }

            const response = {
                status : 200,
                message: `Event updated sucessfully and id = ${eventsResult._id}` 
            }
            
            res.json({ data :  response }); 
        } catch (error) {
            
            console.log("EventRoute: Error occured in _editEvent",error);

            res.status(400).json({
                message: error.toString()
            }); 
        }
    }

    private _deleteEvent = async (req: express.Request, res: express.Response) => {
        try {
            const eventsResult = await this.service.deleteEvent(req.params.id);
            
            if(!eventsResult && eventsResult === undefined){
                throw new Error('unable to delete event');
            }

            const response = {
                status : 200,
                message: `Event deleted sucessfully and id = ${eventsResult._id}` 
            }
            
            res.json({ data :  response }); 
        } catch (error) {
            
            console.log("EventRoute: Error occured in _deleteEvent",error);

            res.status(400).json({
                message: error.toString()
            }); 
        }
    }

    private _getEvents = async (req: express.Request, res: express.Response) => {
        try {
            const eventsResult = await this.service.getEvents();
            
            if(!eventsResult && eventsResult === undefined){
                throw new Error('unable to get user list');
            }
            
            res.json({ data :  eventsResult }); 
        } catch (error) {
            
            console.log("EventRoute: Error occured in _getEvents",error);

            res.status(400).json({
                message: error.toString()
            }); 
        }
    }
}

export default EventRoutes