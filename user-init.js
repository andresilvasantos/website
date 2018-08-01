const config = require(__dirname + '/config.js')
const mongoose = require("mongoose")
const User = require('./src/models/user')

mongoose.Promise = global.Promise
mongoose.connect("mongodb://" + config.db.username + ":" + config.db.password +
    "@" + config.db.host + ":" + config.db.port + "/" + config.db.name,
    { useMongoClient: true },
    function(error) {
        if(error) {
            console.log(error)
            process.exit(1)
        }
        else {
            console.log("Connection to the database successful.")

            const userData = {
                email: config.user.email,
                password: config.user.password,
                username: config.user.username
            }

            User.create(userData, function (error, user) {
                if (error) {
                    console.log('Error:', error)
                }
                else {
                    console.log('User successfully created.')
                }
                process.exit()
            });
        }
    }
)
