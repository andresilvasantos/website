const User = require('../models/user')
const utils = require('./utils')

module.exports = function(router, app, express, passport) {
	router.route('/admin')
	.get(function(req, res) {
		if(req.user) {
			res.redirect('/')
		}
		else {
			this.global.pageTitle = 'Admin'
			this.render('../client/components/admin', {})
		}
	})

	router.route('/admin/login')
	.post(function(req, res, next) {
		return passport.authenticate('local-login', function(error, user) {
			if (error || !user) {
				res.json(error)
			}
			else {
				req.logIn(user, function(error) {
					if (error) {
						res.json({code: -100, description: 'Internal error.'})
						return next(error)
					}
					res.json({code: 0})
				})
			}
		}) (req, res, next)
	})

	router.route('/admin/logout')
	.get(utils.authRequired, function(req, res, next) {
		req.logOut()
		req.session.destroy()
		res.redirect('/')
	})
}
