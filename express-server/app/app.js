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


const errorHandler = (error, req, res, next) => {
  console.error(error);
  const isHttp = error instanceof HttpError.HttpError;
  const errorResponse = isHttp ? error : HttpError.InternalServerError();
  return res.status(errorResponse.statusCode).json(errorResponse);
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