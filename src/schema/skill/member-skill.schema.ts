import mongoose = require("mongoose");

const  MemberSkillSet = new mongoose.Schema({
    UserName: {
        type: String,
        required: true
    },
    UserId: {
        type: String,
        required: true
    },
    Skills: {
        type: String,
        unique : true,
        required: true
    },
    Exp: {
        type: Number,
        required: true
    },
    EmailId: {
        type: String,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    }
});

export const MemberSkillSetSchema = mongoose.model('MemberSkillSet', MemberSkillSet );





