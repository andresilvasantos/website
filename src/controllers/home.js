const async = require('async')
const utils = require("./utils")
const models = require('../models')
const mongoose = require('mongoose')
const randomIntArray = require('random-int-array');

mongoose.Query.prototype.random = function(count, unique, callback) {
    const query = this

    return query.count(function(error, max) {
		if(max <= 0) {
			callback(null, {})
			return
		}

        if(error) {
			callback(error)
			return
		}

        const docNumbers = randomIntArray({
			count: count,
			max: max,
			unique: unique
		})
        const docs = []
        const promises = docNumbers.map(function(n, index) {
            return new Promise(function(resolve, reject) {
                query.model.find(query._conditions).skip(n).limit(-1)
				.exec(function(error, doc) {
                    if (error) return reject(error)
                    docs[index] = doc[0]
                    resolve()
                });
            });
        });

        Promise.all(promises).then(function() {
            callback(null, docs)
        })
		.catch(function(error) {
			callback(error)
		})
    });
}

module.exports = function(router, app, express) {
	router.route("/")
	.get(function(req, res) {
		async.waterfall([
		    function(callback) {
				models.ShortFilm.find()
				.random(3, true, function(error, shortFilms) {
					if(error) utils.handleError(res, error)

					let content = {}
					content.shortFilms = shortFilms
					callback(null, content);
				})
		    },
			function(content, callback) {
				models.Photograph.count()
				models.Photograph.find()
				.random(8, true, function(error, photographs) {
					if(error) utils.handleError(res, error)
					content.photographs = photographs
					callback(null, content);
				})
		    },
			function(content, callback) {
				models.ElectronicMusic.find()
				.random(3, true, function(error, electronicMusic) {
					if(error) utils.handleError(res, error)
					content.electronicMusic = electronicMusic
					callback(null, content);
				})
		    },
			function(content, callback) {
				models.CodeProject.find()
				.random(4, true, function(error, codeProjects) {
					if(error) utils.handleError(res, error)
					content.codeProjects = codeProjects
					callback(null, content);
				})
		    },
		    function(content, callback) {
				models.Movie.find()
				.random(8, true, function(error, movies) {
					if(error) utils.handleError(res, error)
					content.movies = movies
					callback(null, content);
				})
		    },
			function(content, callback) {
				models.TvShow.find()
				.random(6, true, function(error, tvShows) {
					if(error) utils.handleError(res, error)
					content.tvShows = tvShows
					callback(null, content);
				})
		    },
			function(content, callback) {
				models.Music.find()
				.random(8, true, function(error, music) {
					if(error) utils.handleError(res, error)
					content.music = music
					callback(null, content);
				})
		    },
			function(content, callback) {
				models.VideoGame.find()
				.random(4, true, function(error, videoGames) {
					if(error) utils.handleError(res, error)
					content.videoGames = videoGames
					callback(null, content);
				})
		    }
		], function (error, content) {
			if(error) utils.handleError(res, error)
		    this.render("../client/components/home", {content: content})
		});
	})
}
