var mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    name: String,
    desp: String,
    club: String,
    date: Date,
    stime: String,
    etime: String,
    s_name: String,
    username: String,
    faclname: String
},{
    collection: 'EventModel'
})
const EventModel = mongoose.model('EventModel', EventSchema);

module.exports = EventModel;