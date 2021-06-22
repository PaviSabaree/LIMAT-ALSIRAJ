import { IMemberSubscription, ISubscription } from "../../interfaces/i-subscription";
import { MemberSubscriptions } from "../../schema/member-subscription.schema";
import { Subscriptions } from "../../schema/subscription/subscription.schema";
import { UserSchema } from "../../schema/user.schema";
import { PaymentService } from "../payment/payment.service"

class SubscriptionService {
    public paymentService: PaymentService;

    constructor(){
        this.paymentService = new PaymentService();
    }

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

        } catch (error) {
            console.debug("Error occured in createSubscription");
            throw error;
        }

    }

    public async getSubscriptions(): Promise<any> {
        try {

            return await Subscriptions.find().exec();
        } catch (err) {
            console.debug("Error occured in getEvents");
            throw err;
        }
    }

    public async updateSubscription(subscriptionObj: ISubscription, id: string): Promise<any> {
        try {

            console.log("pop", id);

            return await Subscriptions.findOneAndUpdate(
                { '_id': id },
                {
                    $set: {
                        'type': subscriptionObj.type,
                        'amount': subscriptionObj.amount,
                        'duration': subscriptionObj.duration,
                        'currency': subscriptionObj.currency,
                        'description': subscriptionObj.description
                    }
                }
            ).exec();

        } catch (err) {
            console.debug("Error occured in updateSubscription");
            throw err;
        }
    }

    public async deleteSubscription(subscriptionId: string): Promise<any> {
        try {

            return await Subscriptions.findOneAndDelete({ "_id": subscriptionId }).exec();
        } catch (err) {
            console.debug("Error occured in deleteEvent");
            throw err;
        }
    }

    public async createMemberSubscription(subscriptionObj: IMemberSubscription): Promise<any> {
        try {

            const validity = await this._processValidtity(subscriptionObj.duration);

            const paymentResponse = await this.paymentService(subscriptionObj);
            let membersubscription;

            if(paymentResponse){

                membersubscription = new MemberSubscriptions({
                    userId: subscriptionObj.userId,
                    userType: subscriptionObj.userType,
                    userEmail: subscriptionObj.userEmail,
                    subscriptionId: subscriptionObj.subscriptionId,
                    type: subscriptionObj.type,
                    amount: subscriptionObj.amount,
                    currency: subscriptionObj.currency,
                    validTo: validity.validTo,
                    validFrom: validity.validFrom,
                    description: subscriptionObj.description,
                    status: false,
                    paymentInfo: paymentResponse 
                });

                await membersubscription.save();

                return paymentResponse;
            }else {
                return 'Error: Cannot make the payment, try after some time';
            }
                        

        } catch (error) {
            console.debug("Error occured in createMemberSubscription");
            throw error;
        }

    }

    public async updatePaymentResponse(userId: string): Promise<any> {
        try{
            console.log("pop", userId);

            Subscriptions.findOneAndUpdate(
                { '_id': userId },
                {
                    $set: {
                        'status': true,

                    }
                }
            ).exec();   
            
            UserSchema.findOneAndUpdate(
                { '_id': userId },
                {
                    $set: {
                        'isPaidMember': true,

                    }
                }
            ).exec(); 

        }catch(err){
            console.debug("Error occured in updatePaymentResponse");
            throw err;
        }
    }

    private async _processValidtity(duration: string): Promise<any> {

        const validity = duration.split(' ')[0];
        const currentDate = new Date();
        const currentUTC = currentDate.toUTCString();

        const toDate = new Date(currentDate.setMonth(Number(currentDate.getMonth() + Number(validity))));

        return {
            validFrom : currentUTC,
            validTo : toDate.toUTCString()
        }
    }
}

export default SubscriptionService;