"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
const mongoose = require("mongoose");
const EventsSchema = new mongoose.Schema({
    competitionName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    documentUrl: {
        type: String,
        required: false
    }
});
exports.Events = mongoose.model('EventsSchema', EventsSchema);
//# sourceMappingURL=events.schema.js.map