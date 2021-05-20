import mongoose = require("mongoose");

 const  Users = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true, 
        unique : true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phoneNumber: {
        type: String,
        required: true
    },
    appUser: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
    documentUrl: {
        type: String,
        required: false
    },
})

export const UserSchema = mongoose.model('sample', Users)