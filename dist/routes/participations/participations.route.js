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
const participations_service_1 = require("../../service/participations/participations.service");
class ParticipationsRoute {
    constructor() {
        this.router = express.Router();
        this._applyEvent = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const participants = yield this.service.applyEvent(req.body);
                if (!participants && participants === undefined) {
                    throw new Error('unable to save member skill set');
                }
                const response = {
                    status: 200,
                    message: `SucessFully apply for event Id = ${req.body.eventId} and participantId = ${participants._id}`
                };
                res.json({ data: response });
            }
            catch (err) {
                console.log("MemberSkillRoute: Error occured in _applyEvent", err);
                res.status(400).json({
                    message: err.toString()
                });
            }
        });
        this._getParticipantsList = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const participants = yield this.service.getParticipant(req.query.userId ? req.query.userId.toString() : undefined, req.user);
                if (!participants && participants === undefined) {
                    throw new Error('unable to save member skill set');
                }
                res.json({ data: participants });
            }
            catch (err) {
                console.log("MemberSkillRoute: Error occured in _applyEvent", err);
                res.status(400).json({
                    message: err.toString()
                });
            }
        });
        this._approveParticipant = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const comments = req.body.comments;
                const approveParticipants = yield this.service.
                    approveParticipant(req.params.id, req.params.value, comments);
                if (!approveParticipants && approveParticipants === undefined) {
                    throw new Error('unable to save member skill set');
                }
                const response = {
                    status: 200,
                    message: `SucessFully approved/rejected the participant`
                };
                res.json({ data: response });
            }
            catch (err) {
                console.log("MemberSkillRoute: Error occured in _applyEvent", err);
                res.status(400).json({
                    message: err.toString()
                });
            }
        });
        this._deleteParticipant = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteParticipants = yield this.service.deleteParticipant(req.params.id);
                if (!deleteParticipants && deleteParticipants === undefined) {
                    throw new Error('unable to save member skill set');
                }
                const response = {
                    status: 200,
                    message: `Deleted the participant`
                };
                res.json({ data: response });
            }
            catch (err) {
                console.log("MemberSkillRoute: Error occured in _deleteParticipant", err);
                res.status(400).json({
                    message: err.toString()
                });
            }
        });
        this.router.post('/masters/any/userparticipant/add', authentication_1.default, this._applyEvent);
        this.router.get('/masters/any/userparticipant/list', authentication_1.default, this._getParticipantsList);
        this.router.put('/masters/any/userparticipant/:id/:value', authentication_1.default, this._approveParticipant);
        this.router.delete('/masters/any/userparticipant/delete/:id', authentication_1.default, this._deleteParticipant);
        this.service = new participations_service_1.default();
    }
}
exports.default = ParticipationsRoute;
function Router() {
    throw new Error('Function not implemented.');
}
//# sourceMappingURL=participations.route.js.map