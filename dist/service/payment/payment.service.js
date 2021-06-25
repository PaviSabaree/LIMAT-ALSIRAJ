"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const paypal = require("paypal-rest-sdk");
const constant_enum_1 = require("../../config/constant.enum");
const subscription_schema_1 = require("../../schema/subscription/subscription.schema");
const user_schema_1 = require("../../schema/user.schema");
class PaymentService {
    constructor() {
        paypal.configure({
            'mode': constant_enum_1.PaypalApi.MODE,
            'client_id': constant_enum_1.PaypalApi.CLIENT,
            'client_secret': constant_enum_1.PaypalApi.SECRET
        });
    }
    createPaymentReq(paymentReq) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentReqJson = this._createPaymentReq(paymentReq);
                console.log(JSON.stringify(paymentReqJson));
                //  const response: any ={};
                return yield this.createPayment(paymentReqJson).then((transaction) => {
                    const id = transaction['id'];
                    const links = transaction['links'];
                    let counter = links.length;
                    while (counter--) {
                        if (links[counter].method == 'REDIRECT') {
                            // redirect to paypal where user approves the transaction 
                            return links[counter].href;
                        }
                    }
                }).catch((err) => {
                    throw err;
                });
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    confirmSubscription(paymentId, payerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let status = 'payment not successful';
                paypal.payment.execute(paymentId, payerId, function (error, payment) {
                    if (error) {
                        console.error(error);
                    }
                    else {
                        if (payment.state == 'approved') {
                            const userId = paymentId.split('__userId:')[1];
                            this._updatePaymentResponse(userId);
                            status = 'payment successful';
                        }
                    }
                });
                return status;
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    createPayment(payment) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                paypal.payment.create(payment, function (err, payment) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(payment);
                    }
                });
            });
        });
    }
    _updatePaymentResponse(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("pop", userId);
                subscription_schema_1.Subscriptions.findOneAndUpdate({ '_id': userId }, {
                    $set: {
                        'status': true,
                    }
                }).exec();
                user_schema_1.UserSchema.findOneAndUpdate({ '_id': userId }, {
                    $set: {
                        'isPaidMember': true,
                    }
                }).exec();
            }
            catch (err) {
                console.debug("Error occured in updatePaymentResponse");
                throw err;
            }
        });
    }
    _createPaymentReq(input) {
        return {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `${constant_enum_1.ClienUrl.clientURL}/subscription/success`,
                "cancel_url": `${constant_enum_1.ClienUrl.clientURL}/cancel`
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
                            }
                        ]
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
exports.default = PaymentService;
//# sourceMappingURL=payment.service.js.map