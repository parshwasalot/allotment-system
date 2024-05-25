const express = require('express')
const router = express.Router();

const users = require('../models/user');

//user register
router.post('/register', (req, res) => {
    users.create(req.body)
    .then(data => res.json({flag:1,msg:'success',mydata:data}))
    .catch(err => console.error(err));
});

//user display
router.get('/display', (req, res) => {
    users.find()
    .then(data => {
      if(data.length > 0) {
        res.json({flag:1,msg:'success',mydata:data});
      }else{
        res.json({flag:0,msg:'No Record Found'})
      }
    })
    .catch(err => console.error(err));
  });

  //user delete
  router.delete('/delete/:id', (req, res) => {
    users.findByIdAndDelete(req.params.id)
      .then(data => {
        if (!data) {
          console.log(data);
          return res.status(404).json({ flag: 0, msg: 'Record not found' })
        }
        res.json({ flag: 1, msg: 'Record deleted' });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ flag: 0, msg: 'Error occurred', error: err.message });
      });
  });

//Edit API
router.get('/edit/:id', (req, res) => {
    users.findById(req.params.id)
    .then(data => {
      console.log(data);
      res.json({flag:1,msg:'Record found',mydata:data})
    })
    .catch(err => console.error(err));
  });
  
  //Update
  router.put('/update/:id', (req, res) => {
    users.findByIdAndUpdate(req.params.id, req.body)
    .then(data => {
      console.log(data);
      res.json({flag:1,msg:'Record Updated',mydata:data})
    })
    .catch(err => console.error(err));
  });

  //Admin Change Password
  router.post('/changePassword/:id', async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;
  
    try {
      const user = await users.findById(id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      user.password = newPassword;
      await user.save();
  
      res.json({ success: true, msg: 'Password changed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
  });  
module.exports = router;