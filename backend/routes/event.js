const express = require('express');
const validator = require('validator');
const sanitizeHtml = require('sanitize-html');
const router = express.Router();

// Import Model
const EventModel = require('../models/event');
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

// Register API
router.post('/register', (req, res) => {
    const sanitizedData = sanitizeInput(req.body);

    EventModel.create(sanitizedData)
        .then(data => res.json({ flag: 1, msg: 'success', mydata: data }))
        .catch(err => {
            console.error(err);
            res.status(500).json({ flag: 0, msg: 'Error occurred', error: err.message });
        });
});

// Display API
router.get('/display', (req, res) => {
    EventModel.find()
        .then(data => {
            if (data.length > 0) {
                res.json({ flag: 1, msg: 'success', mydata: data });
            } else {
                res.json({ flag: 0, msg: 'No Record Found' });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ flag: 0, msg: 'Error occurred', error: err.message });
        });
});

// Delete API
router.delete('/delete/:id', (req, res) => {
    EventModel.findByIdAndDelete(req.params.id)
        .then(data => {
            if (!data) {
                return res.status(404).json({ flag: 0, msg: 'Record not found' });
            }
            res.json({ flag: 1, msg: 'Record deleted' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ flag: 0, msg: 'Error occurred', error: err.message });
        });
});

// Edit API
router.get('/edit/:id', (req, res) => {
    EventModel.findById(req.params.id)
        .then(data => {
            if (data) {
                res.json({ flag: 1, msg: 'Record found in EventModel', mydata: data });
            } else {
                res.json({ flag: 0, msg: 'Record not found' });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ flag: 0, msg: 'Error occurred', error: err.message });
        });
});

// Update API
router.put('/update/:id', (req, res) => {
    const sanitizedData = sanitizeInput(req.body);

    EventModel.findByIdAndUpdate(req.params.id, sanitizedData, { new: true })
        .then(data => {
            if (data) {
                res.json({ flag: 1, msg: 'Record updated in EventModel', mydata: data });
            } else {
                res.json({ flag: 0, msg: 'Record not found' });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ flag: 0, msg: 'Error occurred', error: err.message });
        });
});

module.exports = router;
