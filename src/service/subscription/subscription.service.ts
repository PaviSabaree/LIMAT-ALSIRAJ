import { ISubscription } from "../../interfaces/i-subscription";
import { Subscriptions } from "../../schema/subscription/subscription.schema";

class SubscriptionService {

    public async createSubscription(subscriptionObj: ISubscription): Promise<any> {
        try {
            const subscription = new Subscriptions({
                type: subscriptionObj.type,
                duration: subscriptionObj.duration,
                amount: subscriptionObj.amount,
                currency: subscriptionObj.currency,
                description: subscriptionObj.description
            });

            return await subscription.save();

        }catch(error){
            console.debug("Error occured in createSubscription");
            throw error;
        }

    }

    public async getSubscriptions(): Promise<any> {
        try {
            
            return await Subscriptions.find().exec();
        }catch(err){
            console.debug("Error occured in getEvents");
            throw err;
        }
    }

    public async updateSubscription(subscriptionObj: ISubscription,id: string): Promise<any> {
        try {

            console.log("pop",id);

            return await Subscriptions.findOneAndUpdate(
                    {'_id': id},
                    {
                        $set: {
                            'type': subscriptionObj.type,
                            'amount': subscriptionObj.amount,
                            'duration': subscriptionObj.duration,
                            'currency': subscriptionObj.currency,
                            'description':  subscriptionObj.description
                        }
                    }
                ).exec();        
            
        }catch(err){
            console.debug("Error occured in updateSubscription");
            throw err;
        }        
    }

    public async deleteSubscription(subscriptionId: string): Promise<any> {
        try {
            
            return await Subscriptions.findOneAndDelete({"_id" : subscriptionId }).exec();
        }catch(err){
            console.debug("Error occured in deleteEvent");
            throw err;
        } 
    }
}

export default SubscriptionService;