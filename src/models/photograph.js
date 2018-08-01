const mongoose = require('mongoose')
const utils = require('../controllers/utils')

const photographSchema = mongoose.Schema({
    imageId: { type: String, required: true, trim: true }
},
{
	timestamps: true
})

/**
 * Pre remove.
 */

photographSchema.pre("remove", function(next) {
	// Remove local images
	utils.removeThumbnails(this.imageId)
    next()
})

const Photograph = module.exports = mongoose.model(
    'Photograph',
    photographSchema
)
