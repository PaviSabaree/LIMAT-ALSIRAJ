import * as paypal from "paypal-rest-sdk" 
import { ClienUrl, PaypalApi } from "../../config/constant.enum";
import { IMemberSubscription } from "../../interfaces/i-subscription";

class PaymentService {

    constructor(){

        paypal.configure({
            'mode': PaypalApi.MODE,
            'client_id': PaypalApi.CLIENT,
            'client_secret': PaypalApi.SECRET
          });
    }

    public async createPaymentReq(paymentReq: IMemberSubscription): Promise<any> {
        try{

            const paymentReqJson = this._createPaymentReq(paymentReq);
            const response: any ={};


            paypal.payment.create(paymentReqJson, function (error, payment) {
                if(error){
                    console.log(error);
                }else{
                    if(payment.payer.payment_method === 'paypal') {

                        response.paymentId = `${payment.id}__userId:${paymentReq.userId}`;
                        response.payment = payment;
                        
                        let redirectUrl;

                        for(var i=0; i < payment.links.length; i++) {

                            const link = payment.links[i];
                        
                            if (link.method === 'REDIRECT') {
                        
                            redirectUrl = link.href;
                        
                            }
                        
                        }
                        response.redirectUrl = redirectUrl;

                    }
                }

            });

            return response;

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
        
                        status = 'payment successful';;
                    } 
                }
            });

            return status;
        }catch(err){
            console.log(err);
            throw err;
        }
    }

    private _createPaymentReq(input: IMemberSubscription): any {

        return  {
            "intent": "Membership",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `${ClienUrl.clientURL}/subscription/success`,
                "cancel_url": `${ClienUrl.clientURL}/cancel`
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": input.type,
                        "sku": input.subscriptionId,
                        "price": input.amount,
                        "currency": input.currency,
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