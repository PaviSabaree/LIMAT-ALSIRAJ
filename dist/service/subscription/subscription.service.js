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
const subscription_schema_1 = require("../../schema/subscription/subscription.schema");
class SubscriptionService {
    createSubscription(subscriptionObj) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscription = new subscription_schema_1.Subscriptions({
                    type: subscriptionObj.type,
                    duration: subscriptionObj.duration,
                    amount: subscriptionObj.amount,
                    currency: subscriptionObj.currency,
                    description: subscriptionObj.description
                });
                return yield subscription.save();
            }
            catch (error) {
                console.debug("Error occured in createSubscription");
                throw error;
            }
        });
    }
    getSubscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield subscription_schema_1.Subscriptions.find().exec();
            }
            catch (err) {
                console.debug("Error occured in getEvents");
                throw err;
            }
        });
    }
    updateSubscription(subscriptionObj, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("pop", id);
                return yield subscription_schema_1.Subscriptions.findOneAndUpdate({ '_id': id }, {
                    $set: {
                        'type': subscriptionObj.type,
                        'amount': subscriptionObj.amount,
                        'duration': subscriptionObj.duration,
                        'currency': subscriptionObj.currency,
                        'description': subscriptionObj.description
                    }
                }).exec();
            }
            catch (err) {
                console.debug("Error occured in updateSubscription");
                throw err;
            }
        });
    }
    deleteSubscription(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield subscription_schema_1.Subscriptions.findOneAndDelete({ "_id": subscriptionId }).exec();
            }
            catch (err) {
                console.debug("Error occured in deleteEvent");
                throw err;
            }
        });
    }
}
exports.default = SubscriptionService;
//# sourceMappingURL=subscription.service.js.map