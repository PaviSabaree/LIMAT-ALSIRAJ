import { truncate } from "fs";
import mongoose = require("mongoose");

const  SubscriptionSchema = new mongoose.Schema({
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

export const Subscriptions= mongoose.model('Subscriptions', SubscriptionSchema );





