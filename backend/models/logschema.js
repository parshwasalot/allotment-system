const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    loginTime: {
        type: Date,
        default: Date.now
    },
    logoutTime: {
        type: Date
    }
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;