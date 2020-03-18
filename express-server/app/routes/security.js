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

router.post('/auth/token', (req, res, next) => {
    let { email, password } = req.body;
    if (email === undefined || password === undefined) throw new HttpError.BadRequest;

    User.findOne({ email })
        .then(user => {
            if (!user) return next(HttpError.Unauthorized());

            user.comparePassword(password, (err, match) => {
                if (err) return next(err);
                if (!match) return next(HttpError.Unauthorized());

                let payload = { id: user._id };
                let token = jwt.sign(payload, environment.secretKey);
                return res.json({ token });
            });
        }).catch(err => next(err));
});

router.post('/register', (req, res, next) => {
    const user = new User(User.convert(req.body));
    user.save()
        .then(user => res.json(user))
        .catch(err => next(err));
});

module.exports = router;
