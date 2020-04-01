const Mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth');
const User = require('../models/user');


// Get all users
const getUsers = (req, res, next) => {
    User.find({}, { password: 0 })
      .then(users => res.json(users))
      .catch(err => next(err));
};

// Create new user (register)
const createUser = (req, res, next) => {
    const user = new User(User.convert(req.body));
    user.save()
      .then(user => res.json(user))
      .catch(err => next(err));
};

// Get logged user account
const getAccount = authMiddleware.authenticateRoute((req, res, next) => {
    const _id = Mongoose.Types.ObjectId(req.user.id);
    User.findOne({ _id }, { password: 0 })
      .then(data => res.json(data))
      .catch(err => next(err));
});

// Update logged user account
const updateAccount = authMiddleware.authenticateRoute((req, res, next) => {
    const _id = Mongoose.Types.ObjectId(req.user.id);
    User.updateOne({ _id }, req.body, { runValidators: true }).then(() =>
      User.findOne({ _id }, { password: 0 })
        .then(user => res.json(user)))
      .catch(err => next(err));
});

// Delete logged user account
const deleteAccount = authMiddleware.authenticateRoute((req, res, next) => {
    const _id = Mongoose.Types.ObjectId(req.user.id);
    User.deleteOne({ _id })
      .then(() => res.json({ message: 'deleted' }))
      .catch(err => next(err));
});

router.route('/user')
  .get(getUsers)
  .post(createUser)

router.route('/account')
  .get(getAccount)
  .put(updateAccount)
  .delete(deleteAccount);

module.exports = router;
