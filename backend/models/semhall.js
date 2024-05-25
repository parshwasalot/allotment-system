const mongoose = require('mongoose');

const semhallSchema = new mongoose.Schema({
  s_name: String,
  capacity: String
});

const SemHall = mongoose.model('SemHall', semhallSchema);

module.exports = SemHall;