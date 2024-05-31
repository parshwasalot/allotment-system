const express = require('express')
const router = express.Router();

//Import Model
const EventModel = require('../models/event');
const Waitlist = require('../models/waitlist');


//register API
router.post('/register', (req, res) => {
    EventModel.create(req.body)
    .then(data => res.json({flag:1,msg:'success',mydata:data}))
    .catch(err => console.error(err));
});

//display API
router.get('/display', (req, res) => {
    EventModel.find()
    .then(data => {
      if(data.length > 0) {
        res.json({flag:1,msg:'success',mydata:data});
      }else{
        res.json({flag:0,msg:'No Record Found'})
      }
    })
    .catch(err => console.error(err));
  });

  //Delete API
  router.delete('/delete/:id', (req, res) => {
    EventModel.findByIdAndDelete(req.params.id)
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
            res.status(500).json({ flag: 0, msg: 'Error occurred', error: err });
        });
});


// Update route
// Update route
router.put('/update/:id', (req, res) => {
    EventModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(data => {
            if (data) {
                res.json({ flag: 1, msg: 'Record updated in EventModel', mydata: data });
            } else {
                res.json({ flag: 0, msg: 'Record not found' });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ flag: 0, msg: 'Error occurred', error: err });
        });
});


module.exports = router;