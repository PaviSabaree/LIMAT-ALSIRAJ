"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscriptions = void 0;
const mongoose = require("mongoose");
const SubscriptionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});
exports.Subscriptions = mongoose.model('Subscriptions', SubscriptionSchema);
//# sourceMappingURL=subscription.schema.js.map