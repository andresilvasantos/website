const async = require('async')
const fs = require('fs')
const models = require('../models')
const randToken = require('rand-token')
const sharp = require('sharp')
const utils = require('./utils')

module.exports = function(router, app, express, upload) {

    /**
	 * Update category.
	 */

    router.route('/settings/category')
    .post(utils.authRequired, function(req, res) {
        const category = req.body.category
        const content = req.body.content
        const contentName = req.body.contentName

        models.GlobalSettings.findOne({}, function(error, globalSettings) {
            if(!globalSettings) {
                let doc = {}
                doc[category + '.' + contentName] = content

                models.GlobalSettings.create(doc, function(error, globalSettings) {
                    if(error || !globalSettings) {
                        res.json({code: 1, description: error})
                    }
                    else {
                        res.json({code: 0, content: globalSettings})
                    }
                })
            }
            else {
                let oldMedia

                if(contentName == 'background') {
                    oldMedia = globalSettings[category].background
                }

                let update = { $set : {} }
                update.$set[category + '.' + contentName] = content

                models.GlobalSettings.findOneAndUpdate(
                    {},
                    update,
                    { new: true },
                    function(error, globalSettings) {
                        if(error || !globalSettings) {
                            res.json({code: 1, description: error})
                        }
                        else {
                            if(oldMedia) {
                                const thumbsPerImage = 3
                        		for(let i = 0; i < thumbsPerImage; ++i) {
                        			fs.unlink("./static/uploads/" +
                                        oldMedia + "_x" + String(i + 1) + ".jpg",
                                        function(error) {
                                            if(error) console.log(error)
                                        }
                                    )
                        		}
                            }

                            res.json({code: 0, content: globalSettings})
                        }
                    }
                )
            }
        })
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
