const models = require('../models')
const utils = require('./utils')

module.exports = function(router, app, express, upload) {

	/**
	 * Short films.
	 */

	router.route('/shortfilms')
	.get(function(req, res) {
		models.ShortFilm.find({}, function (error, shortFilms) {
			if(error) {
				res.redirect('/error')
				return
			}

			this.global.pageTitle = 'Short Films'
			this.render('../client/components/category', {
				category: 'shortfilms',
				content: shortFilms
			})
		})
	})
	.post(utils.authRequired, function(req, res) {
		models.ShortFilm.create(req.body.content, function (error, shortFilm) {
			if(error) {
				res.json({code: 1, description: String(error)})
			}
			else {
				res.json({code: 0, content: shortFilm})
			}
		})
	})
	.delete(utils.authRequired, function(req, res) {
		models.ShortFilm.findOne({ _id: req.query.id },
			function (error, shortFilm) {
				if(error) {
					res.json({code: 1, description: String(error)})
				}
				else {
					shortFilm.remove(function(error) {
						if(error) {
							res.json({code: 2, description: String(error)})
						}
						else {
							res.json({code: 0})
						}
					})
				}
			}
		)
	})

	/**
	 * Short film single.
	 */

	router.route('/shortfilms/:id')
	.get(function(req, res) {
		models.ShortFilm.findOne({ id: req.params.id },
			function (error, shortFilm) {
				if(error) {
					res.redirect('/error')
					return
				}

				const shortFilmJson = shortFilm.toJSON()

				shortFilmJson.thumbnail = shortFilmJson.images[0]
				shortFilmJson.images.splice(0, 1)

				this.global.pageTitle = shortFilmJson.title
				this.render('../client/components/shortfilm',
				{ content: shortFilmJson })
			}
		)
	})

	/**
	 * Photography.
	 */

    router.route('/photography')
	.get(function(req, res) {
		models.Photograph.find({}, function (error, photographies) {
			if(error) {
				res.redirect('/error')
				return
			}

			this.global.pageTitle = 'Photography'
			this.render('../client/components/category',
			{category: 'photography', content: photographies})
		})
	})
	.post(utils.authRequired, function(req, res) {
		const photographs = []
		for(var i = 0; i < req.body.content.length; ++i) {
			photographs.push({ imageId: req.body.content[i] })
		}

		models.Photograph.create(photographs, function (error, photographs) {
			if(error) {
				res.json({code: 1, description: String(error)})
			}
			else {
				res.json({code: 0, content: photographs})
			}
		})
	})
	.delete(utils.authRequired, function(req, res) {
		models.Photograph.findOne({ _id: req.query.id },
			function (error, photograph) {
				if(error) {
					res.json({code: 1, description: String(error)})
				}
				else {
					photograph.remove(function(error) {
						if(error) {
							res.json({code: 2, description: String(error)})
						}
						else {
							res.json({code: 0})
						}
					})
				}
			}
		)
	})

	/**
	 * Electronic music.
	 */

    router.route('/electronicmusic')
	.get(function(req, res) {
		models.ElectronicMusic.find({}, function (error, electronicMusic) {
			if(error) {
				res.redirect('/error')
				return
			}

			this.global.pageTitle = 'Electronic Music'
			this.render('../client/components/category', {
				category: 'electronicmusic',
				content: electronicMusic
			})
		})
	})
	.post(utils.authRequired, function(req, res) {
		models.ElectronicMusic.create(req.body.content, function (
			error,
			electronicMusic
		) {
			if(error) {
				res.json({code: 1, description: String(error)})
			}
			else {
				res.json({code: 0, content: electronicMusic})
			}
		})
	})
	.delete(utils.authRequired, function(req, res) {
		models.ElectronicMusic.remove({ _id: req.query.id }, function (error) {
			if(error) {
				res.json({code: 1, description: String(error)})
			}
			else {
				res.json({code: 0})
			}
		})
	})

	/**
	 * Code projects.
	 */

    router.route('/codeprojects')
	.get(function(req, res) {
		models.CodeProject.find({}, function (error, codeProjects) {
			if(error) {
				res.redirect('/error')
				return
			}

			this.global.pageTitle = 'Code Projects'
			this.render('../client/components/category', {
				category: 'codeprojects',
				content: codeProjects
			})
		})
	})
	.post(utils.authRequired, function(req, res) {
		models.CodeProject.create(req.body.content, function (
			error,
			codeProject
		) {
			if(error) {
				res.json({code: 1, description: String(error)})
			}
			else {
				res.json({code: 0, content: codeProject})
			}
		})
	})
	.delete(utils.authRequired, function(req, res) {
		models.CodeProject.findOne({ _id: req.query.id },
			function (error, codeProject) {
				if(error) {
					res.json({code: 1, description: String(error)})
				}
				else {
					codeProject.remove(function(error) {
						if(error) {
							res.json({code: 2, description: String(error)})
						}
						else {
							res.json({code: 0})
						}
					})
				}
			}
		)
	})

	/**
	 * Code project single.
	 */

	router.route('/codeprojects/:id')
	.get(function(req, res) {
		models.CodeProject.findOne({ id: req.params.id },
			function (error, codeProject) {
				if(error) {
					res.redirect('/error')
					return
				}

				const codeProjectJson = codeProject.toJSON()

				codeProjectJson.thumbnail = codeProjectJson.images[0]
				codeProjectJson.images.splice(0, 1)

				this.global.pageTitle = codeProjectJson.name
				this.render('../client/components/codeproject',
				{ content: codeProjectJson })
			}
		)
	})

	/**
	 * Movies.
	 */

    router.route('/movies')
	.get(function(req, res) {
		models.Movie.find({}, function (error, movies) {
			if(error) {
				res.redirect('/error')
				return
			}

			this.global.pageTitle = 'Movies'
			this.render('../client/components/category', {
				category: 'movies',
				content: movies
			})
		})
	})
	.post(utils.authRequired, function(req, res) {
		models.Movie.create(req.body.content, function (error, movie) {
			if(error) {
				res.json({code: 1, description: String(error)})
			}
			else {
				res.json({code: 0, content: movie})
			}
		})
	})
	.delete(utils.authRequired, function(req, res) {
		models.Movie.remove({ _id: req.query.id }, function (error) {
			if(error) {
				res.json({code: 1, description: String(error)})
			}
			else {
				res.json({code: 0})
			}
		})
	})

	/**
	 * TV Shows.
	 */

    router.route('/tvshows')
	.get(function(req, res) {
		models.TvShow.find({}, function (error, tvShows) {
			if(error) {
				res.redirect('/error')
				return
			}

			this.global.pageTitle = 'TV Shows'
			this.render('../client/components/category', {
				category: 'tvshows',
				content: tvShows
			})
		})
	})
	.post(utils.authRequired, function(req, res) {
		models.TvShow.create(req.body.content, function (error, tvShow) {
			if(error) {
				res.json({code: 1, description: String(error)})
			}
			else {
				res.json({code: 0, content: tvShow})
			}
		})
	})
	.delete(utils.authRequired, function(req, res) {
		models.TvShow.remove({ _id: req.query.id }, function (error) {
			if(error) {
				res.json({code: 1, description: String(error)})
			}
			else {
				res.json({code: 0})
			}
		})
	})

	/**
	 * Music.
	 */

    router.route('/music')
	.get(function(req, res) {
		models.Music.find({}, function (error, music) {
			if(error) {
				res.redirect('/error')
				return
			}

			this.global.pageTitle = 'Music'
			this.render('../client/components/category', {
				category: 'music',
				content: music
			})
		})
	})
	.post(utils.authRequired, function(req, res) {
		models.Music.create(req.body.content, function (error, music) {
			if(error) {
				res.json({code: 1, description: String(error)})
			}
			else {
				res.json({code: 0, content: music})
			}
		})
	})
	.delete(utils.authRequired, function(req, res) {
		models.Music.remove({ _id: req.query.id }, function (error) {
			if(error) {
				res.json({code: 1, description: String(error)})
			}
			else {
				res.json({code: 0})
			}
		})
	})

	/**
	 * Video games.
	 */

    router.route('/videogames')
	.get(function(req, res) {
		models.VideoGame.find({}, function (error, videoGames) {
			if(error) {
				res.redirect('/error')
				return
			}

			this.global.pageTitle = 'Video Games'
			this.render('../client/components/category', {
				category: 'videogames',
				content: videoGames
			})
		})
	})
	.post(utils.authRequired, function(req, res) {
		models.VideoGame.create(req.body.content, function (error, videoGame) {
			if(error) {
				res.json({code: 1, description: String(error)})
			}
			else {
				res.json({code: 0, content: videoGame})
			}
		})
	})
	.delete(utils.authRequired, function(req, res) {
		models.VideoGame.remove({ _id: req.query.id }, function (error) {
			if(error) {
				res.json({code: 1, description: String(error)})
			}
			else {
				res.json({code: 0})
			}
		})
	})
}
