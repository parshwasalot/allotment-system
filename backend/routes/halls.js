const express = require('express');
const validator = require('validator');
const sanitizeHtml = require('sanitize-html');
const router = express.Router();

const Semhall = require('../models/semhall');
const EventModel = require('../models/event');

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

// Available Sem Hall API
router.post('/available-halls', async (req, res) => {
    try {
        const sanitizedData = sanitizeInput(req.body);
        const { date, stime, etime } = sanitizedData;

        if (!validator.isDate(date) || !validator.isISO8601(stime) || !validator.isISO8601(etime)) {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        const bookedHalls = await EventModel.find({
            date,
            $and: [
                { stime: { $lt: etime }, etime: { $gt: stime } }
            ]
        }).distinct('s_name');

        const availableHalls = await Semhall.find({ s_name: { $nin: bookedHalls } });
        res.json(availableHalls);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Halls available yes or no
router.post('/hallsyn', async (req, res) => {
    try {
        const sanitizedData = sanitizeInput(req.body);
        const { date, stime, etime } = sanitizedData;

        if (!validator.isDate(date) || !validator.isISO8601(stime) || !validator.isISO8601(etime)) {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        const bookedHalls = await EventModel.find({
            date,
            $and: [
                { stime: { $lt: etime }, etime: { $gt: stime } }
            ]
        }).distinct('s_name');

        const available = bookedHalls.length !== 8;

        res.json({ available });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
