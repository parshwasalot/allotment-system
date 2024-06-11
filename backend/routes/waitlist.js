const express = require('express');
const validator = require('validator');
const sanitizeHtml = require('sanitize-html');
const router = express.Router();

const Waitlist = require('../models/waitlist');

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

// Waitlist Register
router.post('/register', (req, res) => {
    const sanitizedData = sanitizeInput(req.body);

    Waitlist.create(sanitizedData)
        .then(data => res.json({flag: 1, msg: 'success', mydata: data}))
        .catch(err => {
            console.error(err);
            res.status(500).json({flag: 0, msg: 'Error occurred', error: err.message});
        });
});

// Waitlist Display API
router.get('/display', (req, res) => {
    Waitlist.find()
        .then(data => {
            if (data.length > 0) {
                res.json({flag: 1, msg: 'success', mydata: data});
            } else {
                res.json({flag: 0, msg: 'No Record Found'});
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({flag: 0, msg: 'Error occurred', error: err.message});
        });
});

// Waitlist Delete API
router.delete('/delete/:id', (req, res) => {
    const sanitizedId = validator.escape(req.params.id);

    Waitlist.findByIdAndDelete(sanitizedId)
        .then(data => {
            if (!data) {
                return res.status(404).json({flag: 0, msg: 'Record not found'});
            }
            res.json({flag: 1, msg: 'Record deleted'});
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({flag: 0, msg: 'Error occurred', error: err.message});
        });
});

// Waitlist Edit API
router.get('/edit/:id', (req, res) => {
    const sanitizedId = validator.escape(req.params.id);

    Waitlist.findById(sanitizedId)
        .then(data => {
            if (!data) {
                return res.status(404).json({flag: 0, msg: 'Record not found'});
            }
            res.json({flag: 1, msg: 'Record found', mydata: data});
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({flag: 0, msg: 'Error occurred', error: err.message});
        });
});

// Waitlist Update
router.put('/update/:id', (req, res) => {
    const sanitizedId = validator.escape(req.params.id);
    const sanitizedData = sanitizeInput(req.body);

    Waitlist.findByIdAndUpdate(sanitizedId, sanitizedData, { new: true })
        .then(data => {
            if (!data) {
                return res.status(404).json({flag: 0, msg: 'Record not found'});
            }
            res.json({flag: 1, msg: 'Record updated', mydata: data});
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({flag: 0, msg: 'Error occurred', error: err.message});
        });
});

module.exports = router;
