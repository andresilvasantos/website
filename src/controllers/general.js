const async = require('async')
const fs = require('fs')
const models = require('../models')
const randToken = require('rand-token')
const sharp = require('sharp')
const utils = require('./utils')

module.exports = function(router, app, express, upload) {

    /**
	 * Global settings.
	 */

    router.route('/settings')
    .post(utils.authRequired, function(req, res) {
        const removeId = req.body.removeImageId

        models.GlobalSettings.findOneAndUpdate(
            {},
            {$set: req.body.content},
            {
                upsert: true,
                new: true
            },
            function(error, generalSettings) {
                if(error) {
                    res.json({code: 1, description: error})
                }
                else {
                    if(removeId) {
                        const thumbsPerImage = 2
                		for(let i = 0; i < thumbsPerImage; ++i) {
                			fs.unlink("./static/uploads/" +
                                removeId + "_x" + String(i + 1) + ".jpg",
                                function(error) {
                                    if(error) console.log(error)
                                }
                            )
                		}
                    }

                    res.json({code: 0, content: generalSettings})
                }
            }
        )
    })

    /**
     * Error.
     */

     router.route("/error")
 	.get(function(req, res) {
 		this.global.pageTitle = 'Error'
 		this.render("../client/components/error", {})
 	})

    /**
     * Void.
     */

     router.route("/void")
 	.get(function(req, res) {
 		this.global.pageTitle = 'Void'
 		this.render("../client/components/void", {})
 	})

    /**
	 * Upload media.
	 */

	router.route('/upload-media')
	.post(utils.authRequired, upload.array('image', 20), function(req, res) {
		const response = []
		for(var i = 0; i < req.files.length; ++i) {
			var imageId = randToken.generate(6)
			var buffer = req.files[i].buffer

			function generateThumbnail(size, buffer, fileName, callback) {
				sharp(buffer)
				.resize(size, size)
				.max()
				.jpeg({
					quality: 70,
					progressive: true
				})
				.toFile('static/uploads/' + fileName + '.jpg', callback)
			}

			async.parallel([
				function(callback) {
					generateThumbnail(400, buffer, imageId + '_x3', callback)
				},
				function(callback) {
					generateThumbnail(800, buffer, imageId + '_x2', callback)
				},
				function(callback) {
					generateThumbnail(1400, buffer, imageId + '_x1', callback)
				}
			], (error) => {
                if(error) console.log(error)
            })

			response.push({originalName: req.files[i].originalname, fileName: imageId, success: true})
		}
		res.json(response)
	})
	.delete(utils.authRequired, function(req, res) {
        const imageCount = 3
		for(var i = 1; i < imageCount + 1; ++i) {
			fs.unlink('./static/uploads/' + req.query.id + '_x' + String(i) + '.jpg', function(error) {
				if(error) console.log(error)
			})
		}

		res.sendStatus(200)
	})
}
