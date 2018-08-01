const mongoose = require('mongoose')
const randToken = require('rand-token')
const utils = require('../controllers/utils')

const codeProjectSchema = mongoose.Schema({
    description: { type: String },
    id: { type: String, required: true, unique: true, default: () => {
		return randToken.generate(5, '0123456789')
	}},
    images: {
        type: Array,
        required: true,
        validate: {
            validator: function(array) {
                return array.every((v) => typeof v === 'string')
            }
        }
    },
    mainColor: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    url: { type: String, trim: true },
    youtubeId: { type: String, trim: true }
},
{
	timestamps: true
})

/**
 * Pre remove.
 */

codeProjectSchema.pre("remove", function(next) {
	// Remove local images
	for(let i = 0; i < this.images.length; ++i) {
		const image = this.images[i]

        utils.removeThumbnails(image)
	}

    next()
})

const CodeProject = module.exports = mongoose.model(
    'CodeProject',
    codeProjectSchema
)
