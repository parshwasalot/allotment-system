// Log Schema
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    loginTime: {
        type: Date,
        default: Date.now
    },
    EventRegister: {
        type: Date
    },
    EventEdited: {
        type: Date
    },
    EventNameEdit: {
        type: Date
    },
    EventDelete: {
        type: Date
    },
    UserRegister: {
        type: Date
    },
    UserEdit: {
        type: Date
    },
    UserDelete: {
        type: Date
    },
    WaitlistReg: {
        type: Date
    },
    WaitlistEdit: {
        type: Date
    },
    WaitlistDelete: {
        type: Date
    },
    AdminChangedPassword: {
        type: Date
    },
    FacultyChangedPassword: {
        type: Date
    },
    logoutTime: {
        type: Date
    }
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
