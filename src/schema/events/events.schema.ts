import mongoose = require("mongoose");

const  EventsSchema = new mongoose.Schema({
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
    }
});

export const Events = mongoose.model('EventsSchema', EventsSchema );
