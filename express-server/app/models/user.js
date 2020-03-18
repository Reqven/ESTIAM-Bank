const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const AddressSchema = require('./address');


const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const SchemaDefinition = {
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        match: [emailRegex, 'Invalid email address']
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: AddressSchema.schema,
        required: true
    }
};
const UserSchema = new mongoose.Schema(SchemaDefinition, { bufferCommands: false });


UserSchema.path('email').validate(function (email) {
    return this.model('User').count({ email }).then(count => !count);
}, 'Email address is already used');

UserSchema.pre('save', function (next) {
    let user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10).then(salt => {
            bcrypt.hash(user.password, salt).then(hash => {
                user.password = hash;
                next();
            })
        }).catch(err => next(err));
    } else next();
});

UserSchema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password)
        .then(match => callback(null, match))
        .catch(err => callback(err));
};

UserSchema.statics.convert = function(obj) {
    const paths = Object.keys(SchemaDefinition);
    return paths.reduce((o, key) => ({...o, [key]: obj[key]}), {});
};

module.exports = mongoose.model('User', UserSchema);
