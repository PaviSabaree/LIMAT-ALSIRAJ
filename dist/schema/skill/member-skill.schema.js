"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberSkillSetSchema = void 0;
const mongoose = require("mongoose");
const MemberSkillSet = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    skills: {
        type: String,
        required: true
    },
    exp: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    }
});
exports.MemberSkillSetSchema = mongoose.model('MemberSkillSet', MemberSkillSet);
//# sourceMappingURL=member-skill.schema.js.map