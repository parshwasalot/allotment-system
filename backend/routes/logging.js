const express = require('express');
const router = express.Router();
const Log = require('../models/logschema'); // Adjust the path as necessary

// Log login time
router.post('/log-login', async (req, res) => {
    const { username } = req.body;

    try {
        const newLog = new Log({ username });
        await newLog.save();
        res.status(200).send({ message: 'Login time logged successfully' });
    } catch (error) {
        console.error('Error logging login time:', error);
        res.status(500).send({ message: 'Error logging login time' });
    }
});

//logout log
router.post('/logout', async (req, res) => {
    const { username } = req.body;
  
    try {
      const log = await Log.findOne({ username }).sort({ loginTime: -1 });
  
      if (log) {
        log.logoutTime = new Date();
        await log.save();
        res.status(200).send({ message: 'Logout time updated successfully' });
      } else {
        res.status(404).send({ message: 'Login record not found' });
      }
    } catch (error) {
      console.error('Error updating logout time:', error);
      res.status(500).send({ message: 'Error updating logout time' });
    }
  });

module.exports = router;