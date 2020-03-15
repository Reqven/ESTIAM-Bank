const HttpError = require('http-errors');
const HttpStatus = require('http-status-codes');
const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth');
const User = require('../models/user');


router.get('/', authMiddleware.authenticateRoute((req, res, next) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => next(err));
}));

module.exports = router;