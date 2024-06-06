// SemHall Schema
const mongoose = require('mongoose');

const semhallSchema = new mongoose.Schema({
    s_name: {
        type: String,
        required: true,
        trim: true
    },
    capacity: {
        type: String,
        required: true,
        trim: true
    }
});

const SemHall = mongoose.model('SemHall', semhallSchema);

module.exports = SemHall;
