const express = require("express");
const HttpError = require("http-errors");
const HttpStatus = require("http-status-codes");
const MongoClient = require("mongodb").MongoClient;

// Constants
const PORT = 8080;
const HOST = "0.0.0.0";
const app = express();

function errorHandler(error, req, res, next) {
  console.error(error);
  const isHttp = error instanceof HttpError.HttpError;
  const errorResponse = isHttp ? error : HttpError.InternalServerError();
  return res.status(errorResponse.statusCode).json(errorResponse);
}

app.get("/", (req, res, next) => {
  MongoClient.connect(
    "mongodb://mongodb:27017/admin",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    (err, db) => {
      if (err) {
        console.log(err);
        return next(
          HttpError.InternalServerError("Unable to connect to MongoDB")
        );
      }
      const response = { message: "Connection successful to MongoDB" };
      return res.status(HttpStatus.OK).json(response);
    }
  );
});

app.use(errorHandler);
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
