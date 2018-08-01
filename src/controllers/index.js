const models = require('../models')

module.exports = function(app, express, passport, upload) {

	var router = express.Router()

	router.use(function (req, res, next) {
		this.global = {
			csrfToken: req.csrfToken()
		}
		this.render = function(path, data) {
			data.$global = this.global
			data.$global.serializedGlobals = {
				csrfToken: true,
				globalSettings: true,
				loggedUser: true
			}
			return res.marko(require(path), data)
		}
		next()
	})

	// Check if user is logged in and add it to global out
	router.use(function (req, res, next) {
		if(req.user) {
			this.global.loggedUser = req.user
			this.global.loggedUser.password = ''
		}
		next()
	})

	// Fetch global settings and add it to global out
	router.use(function (req, res, next) {
		models.GlobalSettings.findOne({}, function (error, globalSettings) {
			if(error) utils.handleError(res, error)

			this.global.globalSettings = globalSettings
			next()
		})
	})

	require('./home')(router, app, express)
	require('./categories')(router, app, express, upload)
	require('./admin')(router, app, express, passport)
	require('./general')(router, app, express, upload)

	/**
	 * //404 Route (ALWAYS Keep this as the last route)
	 */

	router.route('*')
	.get(function(req, res) {
		res.redirect('/void')
	})

	return router
}
