const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require("http-errors");
const HttpStatus = require("http-status-codes");

const environment = require('./config/environment');
const authMiddleware = require('./middlewares/auth');
const securityRoutes = require('./routes/security');
const userRoutes = require('./routes/user');
const db = require('./config/database');

const mongoose = require('mongoose');


const errorHandler = (error, req, res, next) => {
  console.log(error);
  let response = HttpError.InternalServerError();
  if (error instanceof HttpError.HttpError) {
    response = error;
  }
  if (error instanceof mongoose.Error.ValidationError) {
    response = new HttpError(HttpStatus.BAD_REQUEST, error._message, {
      errors: Object.values(error.errors)
        .filter(e => !e.errors)
        .map(e => e.message)
    });
  }
  return res.status(response.statusCode).json(response);
};

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(authMiddleware.passport.initialize());

app.use(securityRoutes);
app.use('/user', userRoutes);
app.use(errorHandler);

app.listen(environment.port, environment.host);
console.log(`Running on http://${environment.host}:${environment.port}`);
