require('app-module-path').addPath(__dirname);
const express = require('express')
const markoExpress = require('marko/express')
const pjson = require('./package.json')
const config = require(__dirname + '/config.js')
const mongoose = require("mongoose")
const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const compression = require("compression")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const csrf = require("csurf")
const http = require("http")
const passport = require("passport")
const multer = require('multer')
// var https = require('https');
// var forceSSL = require('express-force-ssl');

require("marko/node-require").install()
require("marko/browser-refresh").enable()
require("lasso/browser-refresh").enable("*.marko *.css *.less")
require("lasso").configure({
	plugins: [
		"lasso-less",
		"lasso-marko"
	],
	bundlingEnabled: config.production, // Only enable bundling in production
	cacheProfile: config.production ? "production" : "development",
	fingerprintsEnabled: true, // Only add fingerprints to URLs in production, actually needs to be enabled for lasso-less to work properly
	minify: config.production, //Don't minify for now, otherwise too verbose in console // Only minify JS and CSS code in production
	outputDir: __dirname + "/static" // Place all generated JS/CSS/etc. files into the "static" dir
})

function setupApp() {
	var app = express()

	app.use(markoExpress())
	app.use(require("lasso/middleware").serveStatic())
	app.use(cookieParser())
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({extended: true}))
	app.use(csrf({cookie: true}))
	app.use(compression())
	//app.use(forceSSL); //TODO enable for production

	var storage = multer.memoryStorage()
	var upload = multer({
		storage : storage
	})

	mongoose.Promise = global.Promise
	mongoose.connect("mongodb://" + config.db.username + ":" + config.db.password + "@" + config.db.host + ":" + config.db.port + "/" + config.db.name,
		{ useMongoClient: true },
		function(error) {
			if(error) {
				console.log(error)
				process.exit(1)
			}
			else {
				console.log("Connection to the database successful.")
			}
		}
	)

	var store = new MongoStore ({
		mongooseConnection: mongoose.connection,
		collection: "sessions",
		touchAfter: 24 * 3600 // time period in seconds
	})

	store.on("error", function(error) {
		assert.ifError(error)
		assert.ok(false)
	})

	app.use(session ({
		secret: config.cookieSecret,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
		},
		store: store,
		saveUninitialized: false, // don't create session until something stored
		resave: true // don't save session if unmodified
	}))
	app.use(passport.initialize())
	app.use(passport.session())

	require("./src/controllers/passport")(passport)
	app.use(require("./src/controllers/")(app, express, passport, upload))

	return app
}

var app = setupApp()

var server = http.createServer(app)
server.listen(config.server.port,function() {
	console.log("Website server v%s listening at https://%s:%s", pjson.version, config.server.address, config.server.port)

	if (process.send) {
		process.send("online")
	}
})

/*var sslOptions = {
	key: fs.readFileSync("certificates/client-key.pem"),
	cert: fs.readFileSync("certificates/client-cert.pem")
}*/

/*var secureServer = https.createServer(sslOptions, app);
secureServer.listen(443, function() {
    console.log("Andre Silva Santos server v%s listening at https://%s:%s", pjson.version, config.server.address, config.server.port)

    if (process.send) {
        process.send('online');
    }
})*/
