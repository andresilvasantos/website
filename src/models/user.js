const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true, trim: true},
    username: { type: String, required: true, unique: true, trim: true},
    password: { type: String, required: true }
})

/**
 * Hash password before save user.
 */

userSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (error, hash) {
    if (error) return next(error);

    user.password = hash;
    next();
  })
});

/**
 * Authenticate input against database.
 */

userSchema.statics.authenticate = function (username, password, callback) {
    User.findOne({ username: username }).exec(function (error, user) {
        if(error) {
            return callback({code: -1, description: 'Internal error.'})
        }
        else if(!user) {
            return callback({
                code: 1,
                description: 'Wrong username / password.'
            })
        }

        bcrypt.compare(password, user.password, function (error, result) {
            if (result) {
                return callback(null, user)
            }
            else {
                return callback({
                    code: 2,
                    description: 'Wrong username / password.'
                })
            }
        })
    });
}

const User = module.exports = mongoose.model('User', userSchema)
