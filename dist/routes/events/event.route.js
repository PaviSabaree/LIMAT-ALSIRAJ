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
const event_service_1 = require("../../service/events/event.service");
class EventRoutes {
    constructor() {
        this.router = express.Router();
        this._addEvent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const eventsResult = yield this.service.addEvent(req.body);
                if (!eventsResult && eventsResult === undefined) {
                    throw new Error('unable to save event');
                }
                const response = {
                    status: 200,
                    message: `Event created sucessfully and id = ${eventsResult._id}`
                };
                res.json({ data: response });
            }
            catch (error) {
                console.log("EventRoute: Error occured in addEventroure", error);
                res.status(400).json({
                    message: error.toString()
                });
            }
        });
        this._editEvent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const eventsResult = yield this.service.editEvent(req.body, req.params.id);
                if (!eventsResult && eventsResult === undefined) {
                    throw new Error('unable to update event');
                }
                const response = {
                    status: 200,
                    message: `Event updated sucessfully and id = ${eventsResult._id}`
                };
                res.json({ data: response });
            }
            catch (error) {
                console.log("EventRoute: Error occured in _editEvent", error);
                res.status(400).json({
                    message: error.toString()
                });
            }
        });
        this._deleteEvent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const eventsResult = yield this.service.deleteEvent(req.params.id);
                if (!eventsResult && eventsResult === undefined) {
                    throw new Error('unable to delete event');
                }
                const response = {
                    status: 200,
                    message: `Event deleted sucessfully and id = ${eventsResult._id}`
                };
                res.json({ data: response });
            }
            catch (error) {
                console.log("EventRoute: Error occured in _deleteEvent", error);
                res.status(400).json({
                    message: error.toString()
                });
            }
        });
        this._getEvents = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const eventsResult = yield this.service.getEvents();
                if (!eventsResult && eventsResult === undefined) {
                    throw new Error('unable to get user list');
                }
                res.json({ data: eventsResult });
            }
            catch (error) {
                console.log("EventRoute: Error occured in _getEvents", error);
                res.status(400).json({
                    message: error.toString()
                });
            }
        });
        this.router.post('/masters/any/competition/add', authentication_1.default, this._addEvent);
        this.router.put('/masters/any/competition/edit/:id', authentication_1.default, this._editEvent);
        this.router.delete('/masters/any/competition/delete/:id', authentication_1.default, this._deleteEvent);
        this.router.get('/masters/any/competition/list', this._getEvents);
        this.service = new event_service_1.default();
    }
}
exports.default = EventRoutes;
//# sourceMappingURL=event.route.js.map