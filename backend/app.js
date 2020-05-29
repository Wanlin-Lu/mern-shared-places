const express = require('express');
const bodyParser= require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes); // => /api/places/...
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSend) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({message: error.message || "An unknown error occurred!"});
})

mongoose
  .connect('mongodb+srv://luwanlin:R37T9XXsQivoY4pq@shareplaces-u7evs.gcp.mongodb.net/mern?retryWrites=true&w=majority')
  .then(() => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err)
  })