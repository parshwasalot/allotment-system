const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  cat: String,
  name: String,
  mobile: String
});

userSchema.methods.comparePassword = function(candidatePassword) {
  return candidatePassword === this.password;
};

const User = mongoose.model('User', userSchema);

module.exports = User;