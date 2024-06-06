const express = require('express');
const validator = require('validator');
const sanitizeHtml = require('sanitize-html');
const router = express.Router();
const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper function to sanitize input
function sanitizeInput(data) {
    const sanitizedData = {};
    for (const key in data) {
        if (typeof data[key] === 'string') {
            sanitizedData[key] = sanitizeHtml(data[key], {
                allowedTags: [],
                allowedAttributes: {}
            }).trim();
        } else {
            sanitizedData[key] = data[key];
        }
    }
    return sanitizedData;
}

// Login API
router.post('/login', (req, res) => {
    const sanitizedData = sanitizeInput(req.body);
    const { username, password } = sanitizedData;

    if (!username || !password) {
        return res.status(400).json({ flag: 0, message: "Username and password are required" });
    }

    // Validate the sanitized input
    if (!validator.isAlphanumeric(username) || !validator.isLength(username, { min: 3, max: 30 })) {
        return res.status(400).json({ flag: 0, message: "Invalid username format" });
    }

    UserModel.findOne({ username: username })
        .then(user => {
            if (!user) {
                return res.status(401).json({ flag: 0, message: "Invalid username or password" });
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ flag: 0, message: "Internal server error" });
                }

                if (!isMatch) {
                    return res.status(401).json({ flag: 0, message: "Invalid username or password" });
                }

                const token = jwt.sign(
                    { userId: user._id, username: user.username, cat: user.cat, name: user.name },
                    'test#123', // Secret key
                    { expiresIn: '1h' } // Token expiration time
                );

                res.status(200).json({ flag: 1, token: token, mydata: user });
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ flag: 0, message: "Internal server error" });
        });
});

module.exports = router;
