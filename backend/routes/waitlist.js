const express = require('express')
const router = express.Router();

const Waitlist = require('../models/waitlist');

//Waitlist
router.post('/register', (req, res) => {
    Waitlist.create(req.body)
    .then(data => res.json({flag:1,msg:'success',mydata:data}))
    .catch(err => console.error(err));
  });
  
  //Waitlist Display API
  router.get('/display', (req, res) => {
    Waitlist.find()
    .then(data => {
      if(data.length > 0) {
        res.json({flag: 1, msg: 'success', mydata: data});
      } else {
        res.json({flag: 0, msg: 'No Record Found'});
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({flag: 0, msg: 'Error occurred', error: err});
    });
  });
  
  //Waitlist Delete API
  router.delete('/delete/:id', (req, res) => {
    Waitlist.findByIdAndDelete(req.params.id)
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
  
  //Waitlist Edit API
  router.get('/edit/:id', (req, res) => {
    Waitlist.findById(req.params.id)
    .then(data => {
      console.log(data);
      res.json({flag:1,msg:'Record found',mydata:data})
    })
    .catch(err => console.error(err));
  });
  
  //Waitlist Update
  router.put('/update/:id', (req, res) => {
    Waitlist.findByIdAndUpdate(req.params.id, req.body)
    .then(data => {
      console.log(data);
      res.json({flag:1,msg:'Record Updated',mydata:data})
    })
    .catch(err => console.error(err));
  });

  module.exports = router;