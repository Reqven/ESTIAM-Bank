const MongoClient = require("mongodb").MongoClient;
const HttpError = require('http-errors');
const HttpStatus = require('http-status-codes');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const environment = require('../config/environment');
const User = require('../models/user');


router.get('/', (req, res, next) => {
    let options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
    };
    MongoClient.connect(environment.databaseURI, options)
        .then(() => res.json({ message: 'Connection successful to MongoDB' }))
        .catch(() => next(HttpError.InternalServerError('Unable to connect to MongoDB')));
});

router.post('/token', (req, res, next) => {
    let { username, password } = req.body;
    if (username === undefined || password === undefined) throw new HttpError.BadRequest;

    User.findOne({ username })
        .then(user => {
            if (!user) return next(HttpError.Unauthorized());

            user.comparePassword(password, (err, match) => {
                if (err) return next(err);
                if (!match) return next(HttpError.Unauthorized());

                let payload = { id: user._id };
                let token = jwt.sign(payload, environment.secretKey);
                return res.status(HttpStatus.OK).json({ token });
            });
        }).catch(err => next(err));
});

router.post('/register', (req, res, next) => {
    let { username, password } = req.body;
    if (username === undefined || password === undefined) throw new HttpError.BadRequest;

    const user = new User({ username, password });
    user.save()
        .then(user => res.json(user))
        .catch(err => next(err));
});

module.exports = router;