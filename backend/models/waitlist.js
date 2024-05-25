var mongoose = require('mongoose');

const WaitSchema = new mongoose.Schema({
    name: String,
    desp: String,
    club: String,
    date: Date,
    stime: String,
    etime: String,
    username: String,
    faclname: String
},{
    collection: 'Waitlist'
})
const WaitlistModel = mongoose.model('WaitlistModel', WaitSchema);

module.exports = WaitlistModel;