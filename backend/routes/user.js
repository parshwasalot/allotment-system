const express = require('express');
const validator = require('validator');
const sanitizeHtml = require('sanitize-html');
const router = express.Router();

const users = require('../models/user');

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

// User register
router.post('/register', (req, res) => {
    const sanitizedData = sanitizeInput(req.body);

    // Additional validation for required fields can be added here
    users.create(sanitizedData)
        .then(data => res.json({flag:1,msg:'success',mydata:data}))
        .catch(err => {
            console.error(err);
            res.status(500).json({flag:0,msg:'Error occurred',error:err.message});
        });
});

// User display
router.get('/display', (req, res) => {
    users.find()
        .then(data => {
            if(data.length > 0) {
                res.json({flag:1,msg:'success',mydata:data});
            } else {
                res.json({flag:0,msg:'No Record Found'});
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({flag:0,msg:'Error occurred',error:err.message});
        });
});

// User delete
router.delete('/delete/:id', (req, res) => {
    const sanitizedId = validator.escape(req.params.id);
    users.findByIdAndDelete(sanitizedId)
        .then(data => {
            if (!data) {
                return res.status(404).json({flag:0,msg:'Record not found'});
            }
            res.json({flag:1,msg:'Record deleted'});
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({flag:0,msg:'Error occurred',error:err.message});
        });
});

// Edit API
router.get('/edit/:id', (req, res) => {
    const sanitizedId = validator.escape(req.params.id);
    users.findById(sanitizedId)
        .then(data => {
            if (!data) {
                return res.status(404).json({flag:0,msg:'Record not found'});
            }
            res.json({flag:1,msg:'Record found',mydata:data});
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({flag:0,msg:'Error occurred',error:err.message});
        });
});

// Update
router.put('/update/:id', (req, res) => {
    const sanitizedId = validator.escape(req.params.id);
    const sanitizedData = sanitizeInput(req.body);

    users.findByIdAndUpdate(sanitizedId, sanitizedData, { new: true })
        .then(data => {
            if (!data) {
                return res.status(404).json({flag:0,msg:'Record not found'});
            }
            res.json({flag:1,msg:'Record updated',mydata:data});
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({flag:0,msg:'Error occurred',error:err.message});
        });
});

// Admin Change Password
router.post('/changePassword/:id', async (req, res) => {
    const sanitizedId = validator.escape(req.params.id);
    const { newPassword } = sanitizeInput(req.body);

    try {
        const user = await users.findById(sanitizedId);
        if (!user) {
            return res.status(404).json({msg:'User not found'});
        }

        user.password = newPassword; // In real applications, remember to hash the password before saving
        await user.save();

        res.json({success:true,msg:'Password changed successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({msg:'Server error'});
    }
});

router.post('/check-username', async (req, res) => {
    try {
      const { username } = req.body;
      const user = await users.findOne({ username });
      if (user) {
        return res.status(200).json({ exists: true });
      } else {
        return res.status(200).json({ exists: false });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
  });

module.exports = router;
