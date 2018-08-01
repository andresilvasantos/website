var LocalStrategy    = require("passport-local").Strategy
var User = require("../models/user")

module.exports = function(passport) {

    /**
     * Passport session setup.
     *
     * required for persistent login sessions
     * passport needs ability to serialize and unserialize users out of session
     */

	passport.serializeUser(function(user, done) {
		done(null, user)
	})

	passport.deserializeUser(function(user, done) {
		done(null, user)
	})

    /**
     * Local login.
     */

	passport.use("local-login", new LocalStrategy({
		usernameField : "username",
		passwordField : "password"
	},
	function(username, password, done) {
		process.nextTick(function() {
            User.authenticate(username, password, function(error, user) {
                if (error || !user) {
                    return done(error)
    			}
                else {
                    return done(null, user)
                }
            })
		})
	}))
}
