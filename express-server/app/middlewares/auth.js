const HttpError = require('http-errors');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');

const environment = require('../config/environment');
const User = require('../models/user');


// Define JwtStrategy to authenticate users
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: environment.secretKey
};
const strategy = new JwtStrategy(jwtOptions, (jwtPayload, next) => {
    console.log('Payload received', jwtPayload);

    User.findOne({ _id: jwtPayload.id })
        .catch(err => next(err))
        .then(user => { return user
            ? next(null, user)
            : next(HttpError.Unauthorized());
        });
});
const authenticateRoute = (routeCallback) => {
    return (req, res, next) => {
        passport.authenticate('jwt', (err, user, info) => {
            if (err) return next(err);
            if (!user) throw new HttpError.Unauthorized;

            req.user = user;
            routeCallback(req, res, next);
        })(req, res, next);
    };
};

passport.use(strategy);
module.exports = { passport, authenticateRoute };
