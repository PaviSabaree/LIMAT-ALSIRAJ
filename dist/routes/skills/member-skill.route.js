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
const express = require("express");
const authentication_1 = require("../../middleware/authentication");
const member_skill_service_1 = require("../../service/skills/member-skill.service");
class MemberSkillRoute {
    constructor() {
        this.router = express.Router();
        this._addMemberSkillSet = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const skillSaveResult = yield this.skillService.addMemberSkillSet(req.body);
                if (!skillSaveResult && skillSaveResult === undefined) {
                    throw new Error('unable to save member skill set');
                }
                const response = {
                    status: 200,
                    message: `Skills created sucessfully and id = ${skillSaveResult._id}`
                };
                res.json({ data: response });
            }
            catch (err) {
                console.log("MemberSkillRoute: Error occured in addMemberSkillSet", err);
                res.status(400).json({
                    message: err.toString()
                });
            }
        });
        this._getMemberSkillSet = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let userId;
                if (req.query && req.query.userId) {
                    userId = req.query.userId;
                }
                const skillSaveResultArray = yield this.skillService.getMemberSkillList(userId, req.user);
                res.json({ data: skillSaveResultArray });
            }
            catch (err) {
                console.log("Error occured in getting admin list", err);
                res.status(400).json({
                    message: err.toString()
                });
            }
        });
        this._editMemberSkillSet = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const skillSaveResultObject = yield this.skillService.editMemberSkillSet(req.body, req.params.id);
                if (!skillSaveResultObject && skillSaveResultObject === undefined) {
                    throw new Error('unable to update member skill set');
                }
                const response = {
                    status: 200,
                    message: `Skills updated sucessfully and id = ${skillSaveResultObject._id}`
                };
                res.json({ data: response });
            }
            catch (err) {
                console.log("Error occured in getting admin list", err);
                res.status(400).json({
                    message: err.toString()
                });
            }
        });
        this._deleteMemberSkillSet = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.skillService.deleteMemberSkillSet(req.params.id);
                if (!result && result === undefined) {
                    throw new Error('unable to delete event');
                }
                const response = {
                    status: 200,
                    message: `Skill deleted sucessfully and id = ${result._id}`
                };
                res.json({ data: response });
            }
            catch (err) {
                console.log("Error occured in getting admin list", err);
                res.status(400).json({
                    message: err.toString()
                });
            }
        });
        this.router.post('/masters/any/skills/add', authentication_1.default, this._addMemberSkillSet);
        this.router.get('/masters/any/skills/list', authentication_1.default, this._getMemberSkillSet);
        this.router.put('/masters/any/skills/edit/:id', authentication_1.default, this._editMemberSkillSet);
        this.router.delete('/masters/any/skills/delete/:id', authentication_1.default, this._deleteMemberSkillSet);
        this.skillService = new member_skill_service_1.default();
    }
}
exports.default = MemberSkillRoute;
function Router() {
    throw new Error('Function not implemented.');
}
//# sourceMappingURL=member-skill.route.js.map