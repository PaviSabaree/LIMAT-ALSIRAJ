import * as paypal from "paypal-rest-sdk" 
import { ClienUrl, PaypalApi } from "../../config/constant.enum";
import { IMemberSubscription } from "../../interfaces/i-subscription";
import { MemberSubscriptions } from "../../schema/member-subscription.schema";
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
                    transaction['links'] = links[counter].href;
                    }
                }

                return transaction;

            }).catch((err) =>{
                throw err;
            });
            
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    public async confirmSubscription(paymentId: string, payerId: any, userId: string): Promise<any> {
        try {               
            
            return this._executePayment(paymentId, payerId).then((transaction) => {
                if(transaction){
                    return this._updatePaymentResponse(userId,paymentId);
                }

            }).catch((err) =>{
                throw err;
            });
            // paypal.payment.execute(paymentId, payerId, function(error, payment){
            //     this._updatePaymentResponse('userId');   

            //     if(error){
            //         console.error(error);
            //     } else {
            //         if (payment.state == 'approved'){ 

            //             const userId = paymentId.split('__userId:')[1];
                        
            //             this._updatePaymentResponse(userId);                        
        
            //             status = 'payment successful';
            //         } 
            //     }
            // });

            // return status;
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

    private async _executePayment(paymentId: string, payerId: string){
        return new Promise( ( resolve , reject ) => {
          paypal.payment.execute( paymentId, payerId, function( err , payment ) {
           if ( err ) {
               reject(err); 
           }
          else {
              resolve(payment); 
          }
          }); 
      });
    }

    private async _updatePaymentResponse(userId: string, payId: string): Promise<any> {
        try{
            console.log("pop", userId);

            const subResponse: any = await MemberSubscriptions.findOneAndUpdate(
                { 'payId': payId },
                {
                    $set: {
                        'status': true,

                    }
                }
            ).exec();   
            
            let userResponse: any = '';

            if(subResponse){
            userResponse = await UserSchema.findOneAndUpdate(
                    { '_id': userId },
                    {
                        $set: {
                            'isPaidMember': true,

                        }
                    }
                ).exec(); 
            }else {
                throw new Error('cannot confirm subscription');
            }

            return subResponse;

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