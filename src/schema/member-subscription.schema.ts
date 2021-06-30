import { truncate } from "fs";
import mongoose = require("mongoose");

const  MembersubscriptionSchema = new mongoose.Schema({
    type: {
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
    },
    userId: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    validFrom: {
        type: String,
        required: true
    },
    validTo: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    payId: {
        type: String,
        required: false
    },
    createdAt: {
        type: String,
        required: false
    },
    paymentInfo : {
        type: Object,
        required: false
    }
});

export const MemberSubscriptions= mongoose.model('memberSubscriptions', MembersubscriptionSchema );





