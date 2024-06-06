// EventModel Schema
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 100
    },
    desp: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 500
    },
    club: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 100
    },
    date: {
        type: Date,
        required: true
    },
    stime: {
        type: String,
        required: true,
        trim: true
    },
    etime: {
        type: String,
        required: true,
        trim: true
    },
    s_name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    faclname: {
        type: String,
        required: true,
        trim: true
    }
}, {
    collection: 'EventModel'
});

const EventModel = mongoose.model('EventModel', EventSchema);

module.exports = EventModel;
