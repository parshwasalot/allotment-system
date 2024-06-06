// User Schema
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    cat: {
        type: String,
        required: true,
        enum: ['admin', 'faculty', 'user']
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    mobile: {
        type: String,
        trim: true
    }
});

userSchema.methods.comparePassword = function(candidatePassword) {
    return candidatePassword === this.password;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
