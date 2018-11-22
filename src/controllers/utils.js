const fs = require('fs')

module.exports = {
	authRequired: function(req, res, next) {
		if (req.user) return next()
		if(req.xhr || req.headers.accept.indexOf('json') > -1) res.send({redirect: '/admin'})
		else res.redirect('/admin')
	},
	removeThumbnails: function(imageId) {
		const thumbsPerImage = 3
		for(let i = 0; i < thumbsPerImage; ++i) {
			fs.unlink("./static/uploads/" + imageId + "_x" +
                String(i + 1) + ".jpg", function(error) {
                    if(error) console.log(error)
                }
            )
		}
	}
}
