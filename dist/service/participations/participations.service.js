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
const events_schema_1 = require("../../schema/events/events.schema");
const participations_schema_1 = require("../../schema/participations/participations.schema");
const send_mail_1 = require("../send.mail");
const fs = require("fs");
const path = require("path");
class ParticipationsService {
    constructor() {
        this.emailService = new send_mail_1.default();
    }
    applyEvent(userInformation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkAlreadyApplied = yield this._isUserAlreadyAppliedForevent(userInformation.userId, userInformation.eventId);
                const eventInformation = yield events_schema_1.Events.findOne({ '_id': userInformation.eventId }).exec();
                if (eventInformation['status'] !== "active") {
                    throw new Error('The Competition is not in active currently. Please apply for some other competition');
                }
                if (!checkAlreadyApplied) {
                    const participants = new participations_schema_1.Participations({
                        userName: userInformation.userName,
                        userId: userInformation.userId,
                        eventId: userInformation.eventId,
                        emailId: userInformation.emailId,
                        eventName: eventInformation.eventName,
                        status: 'PENDING'
                    });
                    return yield participants.save();
                }
                throw new Error('You Already apply for this event, Please edit or apply for new Event');
            }
            catch (err) {
                console.debug("Error occured in applyEvent");
                throw err;
            }
        });
    }
    getParticipant(userId, userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (userId) {
                    return yield participations_schema_1.Participations.find({ 'userId': userId }).exec();
                }
                else {
                    if (userInfo.userType === 'admin') {
                        return yield participations_schema_1.Participations.find().exec();
                    }
                    throw new Error('You are not allow to see all participant details');
                }
            }
            catch (err) {
                console.debug("Error occured in getParticipant");
                throw err;
            }
        });
    }
    approveParticipant(participantId, value, comments) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mailContent = yield this._getMailInformation(participantId, value, comments);
                console.log('after ==', mailContent);
                const result = yield participations_schema_1.Participations.findOneAndUpdate({ '_id': participantId }, {
                    $set: {
                        'status': value
                    }
                }).exec();
                yield this.emailService.sendMail(mailContent);
                return result;
            }
            catch (err) {
                console.debug("Error occured in approveParticipant");
                throw err;
            }
        });
    }
    deleteParticipant(participantId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield participations_schema_1.Participations.findOneAndDelete({ "_id": participantId }).exec();
            }
            catch (err) {
                console.debug("Error occured in approveParticipant");
                throw err;
            }
        });
    }
    _isUserAlreadyAppliedForevent(userId, eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dbResponse = yield participations_schema_1.Participations.findOne({ 'userId': userId }).exec();
                console.log('dbResponse ===', dbResponse, eventId, userId);
                if (dbResponse && dbResponse['eventId'] === eventId) {
                    return true;
                }
                return false;
            }
            catch (err) {
                console.debug("Error occured in getEvents");
                throw err;
            }
        });
    }
    _getMailInformation(participantId, value, comments) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const getParticipantDetails = yield participations_schema_1.Participations.findOne({ '_id': participantId }).exec();
                const getEventInfo = yield events_schema_1.Events.findOne({ '_id': getParticipantDetails['eventId'] }).exec();
                let greetings = ``;
                if (value.toUpperCase() === 'REJECTED') {
                    greetings = `We are  very sorry that your request to attend the event ${getEventInfo['competitionName'] ? getEventInfo['competitionName'] : ''}
                is got rejected. Please try different event`;
                }
                else if (value.toUpperCase() === 'APPROVED') {
                    greetings = `We are  pleased to announce that your request to attend the event ${getEventInfo['competitionName'] ? getEventInfo['competitionName'] : ''}
                is got approved.`;
                }
                else if (value.toUpperCase() === 'HOLD') {
                    greetings = `We are  pleased to announce that your request to attend the event ${getEventInfo['competitionName'] ? getEventInfo['competitionName'] : ''}
                is got Hold by our team. Please wait we check your information again.`;
                }
                let bodyContent = yield fs.readFileSync(path.join(__dirname + '../../../config/mailTemplate.html'));
                bodyContent = bodyContent.toString().replace('user_name', getParticipantDetails['userName'] ? getParticipantDetails['userName'] : '')
                    .replace('collection_name', greetings ? greetings : '').replace('comments', comments ? comments : '');
                resolve({
                    // to: getParticipantDetails.emailId,
                    to: 'suriyathangaraman@gmail.com',
                    subject: getEventInfo['competitionName'],
                    html: bodyContent
                });
            }));
        });
    }
}
exports.default = ParticipationsService;
//# sourceMappingURL=participations.service.js.map