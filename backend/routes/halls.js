const express = require('express')
const router = express.Router();

const Semhall = require('../models/semhall');
const EventModel = require('../models/event');

//Available Sem Hall API
router.post('/available-halls', async (req, res) => {
    const { date, stime, etime } = req.body;
    const bookedHalls = await EventModel.find({
      date,
      $and: [
        { stime: { $lt: etime }, etime: { $gt: stime } }
      ]
    }).distinct('s_name');
  
    const availableHalls = await Semhall.find({ s_name: { $nin: bookedHalls } });
    res.json(availableHalls);
  });
  
  //halls available yes or no
  router.post('/hallsyn', async (req, res) => {
    const { date, stime, etime } = req.body;
    const bookedHalls = await EventModel.find({
      date,
      $and: [
        { stime: { $lt: etime }, etime: { $gt: stime } }
      ]
    }).distinct('s_name');
  
    const available = bookedHalls.length != 8;
  
    res.json({ available });
  });

  module.exports = router;
