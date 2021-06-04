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
class EventService {
    addEvent(eventInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = new events_schema_1.Events({
                    competitionName: eventInfo.competitionName,
                    type: eventInfo.type,
                    status: eventInfo.status,
                    startDate: eventInfo.startDate,
                    endDate: eventInfo.endDate,
                    description: eventInfo.description,
                });
                return yield event.save();
            }
            catch (err) {
                console.debug("Error occured in addEvent");
                throw err;
            }
        });
    }
    editEvent(eventInfo, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield events_schema_1.Events.findOneAndUpdate({ '_id': id }, {
                    $set: {
                        'competitionName': eventInfo.competitionName,
                        'type': eventInfo.type,
                        'status': eventInfo.status,
                        'startDate': eventInfo.startDate,
                        'endDate': eventInfo.endDate,
                        'description': eventInfo.description,
                    }
                }).exec();
            }
            catch (err) {
                console.debug("Error occured in editEvent");
                throw err;
            }
        });
    }
    deleteEvent(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield events_schema_1.Events.findOneAndDelete({ "_id": eventId }).exec();
            }
            catch (err) {
                console.debug("Error occured in deleteEvent");
                throw err;
            }
        });
    }
    getEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield events_schema_1.Events.find().exec();
            }
            catch (err) {
                console.debug("Error occured in getEvents");
                throw err;
            }
        });
    }
}
exports.default = EventService;
//# sourceMappingURL=event.service.js.map