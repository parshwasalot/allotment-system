const express = require('express')
const mongoose = require('mongoose');
var cors = require('cors')
const port = 4000

const app = express()
app.use(express.json());
app.use(cors())

mongoose.connect('mongodb+srv://parshwasalot:0SHMrFJMWVJsOZkM@cluster0.7uipnpe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(()=>console.log("Connection established"))
.catch(err => console.error(err));

const indexRouter = require('./routes/index');
const eventRouter = require('./routes/event');
const hallsRouter = require('./routes/halls');
const waitlistRouter = require('./routes/waitlist');
const userRouter = require('./routes/user');
const logLoginRouter = require('./routes/logging');

app.use('/', indexRouter);
app.use('/logging', logLoginRouter);
app.use('/event', eventRouter);
app.use('/halls', hallsRouter);
app.use('/waitlist', waitlistRouter);
app.use('/user', userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
