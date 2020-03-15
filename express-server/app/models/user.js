const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const SchemaOptions = { bufferCommands: false };
const SchemaDefinition = {
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}
const UserSchema = new mongoose.Schema(SchemaDefinition, SchemaOptions);

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

module.exports = mongoose.model('User', UserSchema);