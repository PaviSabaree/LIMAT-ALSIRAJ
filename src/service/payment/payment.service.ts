import * as paypal from "paypal-rest-sdk" 
import { ClienUrl, PaypalApi } from "../../config/constant.enum";
import { IMemberSubscription } from "../../interfaces/i-subscription";
import { Subscriptions } from "../../schema/subscription/subscription.schema";
import { UserSchema } from "../../schema/user.schema";


class PaymentService {

    constructor() {
        paypal.configure({
            'mode': PaypalApi.MODE,
            'client_id': PaypalApi.CLIENT,
            'client_secret': PaypalApi.SECRET
        });
    }

    public async createPaymentReq(paymentReq: IMemberSubscription): Promise<any> {
        try{

            const paymentReqJson = this._createPaymentReq(paymentReq);

            console.log(JSON.stringify(paymentReqJson));

          //  const response: any ={};

            return await this.createPayment(paymentReqJson).then((transaction) => {

                const id = transaction['id']; 
                const links = transaction['links'];
                let counter = links.length; 
                while( counter -- ) {
                  if ( links[counter].method == 'REDIRECT') {
                    // redirect to paypal where user approves the transaction 
                              return links[counter].href;
                    }
                }

            }).catch((err) =>{
                throw err;
            });
            
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    public async confirmSubscription(paymentId: string, payerId: any): Promise<string> {
        try {
            let status = 'payment not successful';

            

            paypal.payment.execute(paymentId, payerId, function(error, payment){
                if(error){
                    console.error(error);
                } else {
                    if (payment.state == 'approved'){ 

                        const userId = paymentId.split('__userId:')[1];
                        
                        this._updatePaymentResponse(userId);                        
        
                        status = 'payment successful';
                    } 
                }
            });

            return status;
        }catch(err){
            console.log(err);
            throw err;
        }
    }

    private async createPayment(payment: any){
        return new Promise( ( resolve , reject ) => {
          paypal.payment.create( payment , function( err , payment ) {
           if ( err ) {
               reject(err); 
           }
          else {
              resolve(payment); 
          }
          }); 
      });
      }

    private async _updatePaymentResponse(userId: string): Promise<any> {
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

    private _createPaymentReq(input: IMemberSubscription): any {

        return  {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `${ClienUrl.clientURL}/paymentSuccess`,
                "cancel_url": `${ClienUrl.clientURL}/paymentError`
            },
            "transactions": [{
                "item_list": {
                    "items": [
                        {
                        "name": input.type,
                        "sku": input.subscriptionId,
                        "price": input.amount,
                        "currency": input.currency,
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": input.currency,
                    "total": input.amount
                },
                "description": input.description
            }]
        };
    }
}

export default PaymentService;