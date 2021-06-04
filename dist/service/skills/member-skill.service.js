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
const member_skill_schema_1 = require("../../schema/skill/member-skill.schema");
class MemberSkillService {
    addMemberSkillSet(skillSetObj) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skillSet = new member_skill_schema_1.MemberSkillSetSchema({
                    userName: skillSetObj.userName,
                    userId: skillSetObj.userId,
                    skills: skillSetObj.skills,
                    exp: skillSetObj.exp,
                    emailId: skillSetObj.emailId,
                });
                return yield skillSet.save();
            }
            catch (err) {
                console.debug("Error occured in addMemberSkillSet");
                throw err;
            }
        });
    }
    getMemberSkillList(userId, userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (userId) {
                    // authenticate user details             
                    return yield member_skill_schema_1.MemberSkillSetSchema.find({ 'userId': userId }).exec();
                }
                else {
                    // authenticate admin user to gibe all users skills
                    if (userInfo.userType === 'admin') {
                        return yield member_skill_schema_1.MemberSkillSetSchema.find().exec();
                    }
                }
            }
            catch (err) {
                console.debug("Error occured in getMemberSkillList");
                throw err;
            }
        });
    }
    editMemberSkillSet(skillSetObj, skillId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield member_skill_schema_1.MemberSkillSetSchema.findOneAndUpdate({ '_id': skillId }, {
                    $set: {
                        'skills': skillSetObj.skills,
                        'exp': skillSetObj.exp,
                    }
                }).exec();
            }
            catch (err) {
                console.debug("Error occured in editMemberSkillSet");
                throw err;
            }
        });
    }
    deleteMemberSkillSet(skillSetId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield member_skill_schema_1.MemberSkillSetSchema.findOneAndDelete({ "_id": skillSetId }).exec();
            }
            catch (err) {
                console.debug("Error occured in deleteMemberSkillSet");
                throw err;
            }
        });
    }
}
exports.default = MemberSkillService;
//# sourceMappingURL=member-skill.service.js.map