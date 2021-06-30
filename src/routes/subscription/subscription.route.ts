import * as express from "express";
import AuthService from "../../service/auth/auth.service";
import PaymentService from "../../service/payment/payment.service";
import SubscriptionService from "../../service/subscription/subscription.service";

class SubscriptionRoute {
    protected router = express.Router();
    protected subscriptionService: SubscriptionService;
    protected paymentService: PaymentService;
    protected authService: AuthService;

    constructor(){
        this.router.post('/subscription/create', this._createSubscription);
        this.router.get('/subscription/get', this._getSubscription);
        this.router.put('/subscription/update/:id', this._updateSubscription);
        this.router.delete('/subscription/delete/:id', this._deleteSubscription);
        this.router.post('/subscription/member/create', this._createMemberSubscription);
        this.router.post('/subscription/success', this._confirmMemberSubscription);
        this.router.get('/subscription/member', this._getMemberSubscription);
        this.router.get('/subscription/member/:id', this._getMemberSubscriptionById);
        this.subscriptionService = new SubscriptionService();
        this.paymentService = new PaymentService();
        this.authService = new AuthService();
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

    private _createMemberSubscription = async (req: express.Request, res: express.Response) => {
        try {
            const subscriptionResult = await this.subscriptionService.createMemberSubscription(req.body);
            
            if(!subscriptionResult && subscriptionResult === undefined){
                throw new Error('unable to save member subscription');
            }

            const response = {
                status : 200,
                result: subscriptionResult,
                message: `Member subscription initiated sucessfully` 
            }
            
            res.json({ data :  response }); 
        } catch (error) {
            
            console.log("SubscriptionRoute: Error occured in _createMemberSubscription",error);

            res.status(400).json({
                message: error.toString()
            }); 
        }
    }

    private _confirmMemberSubscription = async (req: express.Request, res: express.Response) => {
        try {

            const paymentId = req.query.paymentId.toString();
            const payerId = { 'payer_id': req.query.PayerID.toString() };
            const userId = req.body.userId;

            const confirmationResult = await this.paymentService.confirmSubscription(
               paymentId, 
               payerId,
               userId
            );
            
            if(!confirmationResult && confirmationResult === undefined){
                throw new Error('unable to confirm subscription');
            }

            const response = {
                status : 200,
                result : confirmationResult,
                message: `Member subscription confirmed sucessfully` 
            }
            
            res.json({ data :  response }); 
        } catch (error) {
            
            console.log("SubscriptionRoute: Error occured in _confirmMemberSubscription",error);

            res.status(400).json({
                message: error.toString()
            }); 
        }
    }

    private _getMemberSubscription = async (req: express.Request, res: express.Response) => {
        try {
            const subscriptionResult = await this.subscriptionService.getMemberSubscriptions();
            
            if(!subscriptionResult && subscriptionResult === undefined){
                throw new Error('unable to get the member subscription list');
            }
            
            res.json({ data :  subscriptionResult }); 
        } catch (error) {
            
            console.log("SubscriptionRoute: Error occured in _getMemberSubscription",error);

            res.status(400).json({
                message: error.toString()
            }); 
        }
    }

    private _getMemberSubscriptionById = async (req: express.Request, res: express.Response) => {
        try {
            const subscriptionResult = await this.authService.getMemberSubscriptionsByUserId(req.params.id)
            
            if(!subscriptionResult && subscriptionResult === undefined){
                throw new Error('unable to get the member subscription list');
            }
            
            res.json({ data :  subscriptionResult }); 
        } catch (error) {
            
            console.log("SubscriptionRoute: Error occured in _getMemberSubscriptionById",error);

            res.status(400).json({
                message: error.toString()
            }); 
        }
    }
}
export default SubscriptionRoute;