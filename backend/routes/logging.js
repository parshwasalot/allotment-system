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

//Event Registered
router.post('/evereg', async (req, res) => {
  const { username } = req.body;

  try {
    const log = await Log.findOne({ username }).sort({ loginTime: -1 });

    if (log) {
      log.EventRegister = new Date();
      await log.save();
      res.status(200).send({ message: 'Event Register time updated successfully' });
    } else {
      res.status(404).send({ message: 'Login record not found' });
    }
  } catch (error) {
    console.error('Error updating Event Register time:', error);
    res.status(500).send({ message: 'Error updating Event Register time' });
  }
});

//Event Edit
router.post('/eveedit', async (req, res) => {
  const { username } = req.body;

  try {
    const log = await Log.findOne({ username }).sort({ loginTime: -1 });

    if (log) {
      log.EventEdited = new Date();
      await log.save();
      res.status(200).send({ message: 'Event Edit time updated successfully' });
    } else {
      res.status(404).send({ message: 'Login record not found' });
    }
  } catch (error) {
    console.error('Error updating Event Edit time:', error);
    res.status(500).send({ message: 'Error updating Event Edit time' });
  }
});

//AUser Change Pass
router.post('/auschpass', async (req, res) => {
  const { username } = req.body;

  try {
    const log = await Log.findOne({ username }).sort({ loginTime: -1 });

    if (log) {
      log.AdminChangedPassword = new Date();
      await log.save();
      res.status(200).send({ message: 'A-Change Password time updated successfully' });
    } else {
      res.status(404).send({ message: 'Login record not found' });
    }
  } catch (error) {
    console.error('Error updating A-Change Password time:', error);
    res.status(500).send({ message: 'Error updating A-Change Password time' });
  }
});

//userreg
router.post('/userreg', async (req, res) => {
  const { username } = req.body;

  try {
    const log = await Log.findOne({ username }).sort({ loginTime: -1 });

    if (log) {
      log.UserRegister = new Date();
      await log.save();
      res.status(200).send({ message: 'User Registration time updated successfully' });
    } else {
      res.status(404).send({ message: 'Login record not found' });
    }
  } catch (error) {
    console.error('Error updating User Registration time:', error);
    res.status(500).send({ message: 'Error updating User Registration time' });
  }
});

//FUser Change Pass
router.post('/fuschpass', async (req, res) => {
  const { username } = req.body;

  try {
    const log = await Log.findOne({ username }).sort({ loginTime: -1 });

    if (log) {
      log.FacultyChangedPassword = new Date();
      await log.save();
      res.status(200).send({ message: 'F-Change Password time updated successfully' });
    } else {
      res.status(404).send({ message: 'Login record not found' });
    }
  } catch (error) {
    console.error('Error updating F-Change Password time:', error);
    res.status(500).send({ message: 'Error updating F-Change Password time' });
  }
});

//Waitlist Edit
router.post('/wedit', async (req, res) => {
  const { username } = req.body;

  try {
    const log = await Log.findOne({ username }).sort({ loginTime: -1 });

    if (log) {
      log.WaitlistEdit = new Date();
      await log.save();
      res.status(200).send({ message: 'Waitlist Edit time updated successfully' });
    } else {
      res.status(404).send({ message: 'Login record not found' });
    }
  } catch (error) {
    console.error('Error updating Waitlist Edit time:', error);
    res.status(500).send({ message: 'Error updating Waitlist Edit time' });
  }
});

//waitlist reg
router.post('/wreg', async (req, res) => {
  const { username } = req.body;

  try {
    const log = await Log.findOne({ username }).sort({ loginTime: -1 });

    if (log) {
      log.WaitlistReg = new Date();
      await log.save();
      res.status(200).send({ message: 'Waitlist register time updated successfully' });
    } else {
      res.status(404).send({ message: 'Login record not found' });
    }
  } catch (error) {
    console.error('Error updating Waitlist register time:', error);
    res.status(500).send({ message: 'Error updating Waitlist register time' });
  }
});

//user edit
router.post('/uedit', async (req, res) => {
  const { username } = req.body;

  try {
    const log = await Log.findOne({ username }).sort({ loginTime: -1 });

    if (log) {
      log.UserEdit = new Date();
      await log.save();
      res.status(200).send({ message: 'User Edit time updated successfully' });
    } else {
      res.status(404).send({ message: 'Login record not found' });
    }
  } catch (error) {
    console.error('Error updating User Edit time:', error);
    res.status(500).send({ message: 'Error updating User Edit time' });
  }
});

//partial event edit
router.post('/peveedit', async (req, res) => {
  const { username } = req.body;

  try {
    const log = await Log.findOne({ username }).sort({ loginTime: -1 });

    if (log) {
      log.EventNameEdit = new Date();
      await log.save();
      res.status(200).send({ message: 'Event name Edit time updated successfully' });
    } else {
      res.status(404).send({ message: 'Login record not found' });
    }
  } catch (error) {
    console.error('Error updating Event name Edit time:', error);
    res.status(500).send({ message: 'Error updating Event Name Edit time' });
  }
});

// event delete
router.post('/evedel', async (req, res) => {
  const { username } = req.body;

  try {
    const log = await Log.findOne({ username }).sort({ loginTime: -1 });

    if (log) {
      log.EventDelete = new Date();
      await log.save();
      res.status(200).send({ message: 'Event deleted time updated successfully' });
    } else {
      res.status(404).send({ message: 'Login record not found' });
    }
  } catch (error) {
    console.error('Error updating Event deleted time:', error);
    res.status(500).send({ message: 'Error updating Event deleted time' });
  }
});

//user delete
router.post('/userdel', async (req, res) => {
  const { username } = req.body;

  try {
    const log = await Log.findOne({ username }).sort({ loginTime: -1 });

    if (log) {
      log.UserDelete = new Date();
      await log.save();
      res.status(200).send({ message: 'User Delete time updated successfully' });
    } else {
      res.status(404).send({ message: 'Login record not found' });
    }
  } catch (error) {
    console.error('Error updating User Delete time:', error);
    res.status(500).send({ message: 'Error updating User Delete time' });
  }
});

//waitlist delete
router.post('/wdel', async (req, res) => {
  const { username } = req.body;

  try {
    const log = await Log.findOne({ username }).sort({ loginTime: -1 });

    if (log) {
      log.WaitlistDelete = new Date();
      await log.save();
      res.status(200).send({ message: 'waitlist Delete time updated successfully' });
    } else {
      res.status(404).send({ message: 'Login record not found' });
    }
  } catch (error) {
    console.error('Error updating waitlist Delete time:', error);
    res.status(500).send({ message: 'Error updating waitlist Delete time' });
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