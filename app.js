const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();



//connect databe mongoose to server
mongoose.connect('mongodb+srv://honeyspring:g%72%65e%6El%61nd@cluster0-xoilo.mongodb.net/test?retryWrites=true&w=majority')
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });
  //implemented CORS to make sure the front end could safely make calls to your app.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.use(bodyParser.json());//to extract the JSON object from the request
;

const stuffRoutes = require('./routes/stuff'); //import route
const userRoutes = require('./routes/user');
app.use('/api/stuff', stuffRoutes); //register  route
app.use('/api/user', userRoutes);
module.exports = app;