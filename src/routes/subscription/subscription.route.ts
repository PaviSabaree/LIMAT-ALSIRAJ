import * as express from "express";
import SubscriptionService from "../../service/subscription/subscription.service";

class SubscriptionRoute {
    protected router = express.Router();
    protected subscriptionService: SubscriptionService;

    constructor(){
        this.router.post('/subscription/create', this._createSubscription);
        this.router.get('/subscription/get', this._getSubscription);
        this.router.put('/subscription/update/:id', this._updateSubscription);
        this.router.delete('/subscription/delete/:id', this._deleteSubscription);
        this.subscriptionService = new SubscriptionService();
    }

    private _createSubscription = async (req: express.Request, res: express.Response) => {
        try {
            const subscriptionResult = await this.subscriptionService.createSubscription(req.body);
            
            if(!subscriptionResult && subscriptionResult === undefined){
                throw new Error('unable to save subscription');
            }

            const response = {
                status : 200,
                message: `Event created sucessfully and id = ${subscriptionResult._id}` 
            }
            
            res.json({ data :  response }); 
        } catch (error) {
            
            console.log("SubscriptionRoute: Error occured in _createSubscription",error);

            res.status(400).json({
                message: error.toString()
            }); 
        }
    }

    private _getSubscription = async (req: express.Request, res: express.Response) => {
        try {
            const subscriptionResult = await this.subscriptionService.getSubscriptions();
            
            if(!subscriptionResult && subscriptionResult === undefined){
                throw new Error('unable to get the subscription list');
            }
            
            res.json({ data :  subscriptionResult }); 
        } catch (error) {
            
            console.log("SubscriptionRoute: Error occured in _getSubscription",error);

            res.status(400).json({
                message: error.toString()
            }); 
        }
    }
    

    private _updateSubscription = async (req: express.Request, res: express.Response) => {
        try {
            const subscriptionUpdatedResult = await this.subscriptionService.updateSubscription(req.body, req.params.id);
            
            if(!subscriptionUpdatedResult && subscriptionUpdatedResult === undefined){
                throw new Error('unable to update event');
            }

            const response = {
                status : 200,
                message: `Subscription updated sucessfully and id = ${subscriptionUpdatedResult._id}` 
            }
            
            res.json({ data :  response }); 
        } catch (error) {
            
            console.log("SubscriptionRoute: Error occured in _updateSubscription",error);

            res.status(400).json({
                message: error.toString()
            }); 
        }
    }

    private _deleteSubscription = async (req: express.Request, res: express.Response) => {

    try {
        const subscriptionResult = await this.subscriptionService.deleteSubscription(req.params.id);
            
        if(!subscriptionResult && subscriptionResult === undefined){
            throw new Error('unable to delete subscription');
        }

        const response = {
            status : 200,
            message: `subscription deleted sucessfully and id = ${subscriptionResult._id}` 
        }
        
        res.json({ data :  response }); 
    } catch (error) {
        
        console.log("SubscriptionRoute: Error occured in _deleteSubscription",error);

        res.status(400).json({
            message: error.toString()
        }); 
    }
    }
}
export default SubscriptionRoute;