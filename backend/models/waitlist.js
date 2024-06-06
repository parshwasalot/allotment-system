// WaitlistModel Schema
const mongoose = require('mongoose');

const WaitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    desp: {
        type: String,
        required: true,
        trim: true
    },
    club: {
        type: String,
        required: true,
        trim: true
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
    collection: 'Waitlist'
});

const WaitlistModel = mongoose.model('WaitlistModel', WaitSchema);

module.exports = WaitlistModel;
