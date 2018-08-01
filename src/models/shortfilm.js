const mongoose = require('mongoose')
const randToken = require('rand-token')
const utils = require('../controllers/utils')

const shortFilmSchema = mongoose.Schema({
    description: { type: String },
    genres: {
        type: Array,
        required: true,
        validate: {
            validator: function(array) {
                return array.every((v) => typeof v === 'string')
            }
        }
    },
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
    title: { type: String, required: true, trim: true },
    youtubeId: { type: String, required: true, unique: true, trim: true }
},
{
	timestamps: true
})

/**
 * Pre remove.
 */

shortFilmSchema.pre("remove", function(next) {
	// Remove local images
	for(let i = 0; i < this.images.length; ++i) {
		const image = this.images[i]

        utils.removeThumbnails(image)
	}

    next()
})

const ShortFilm = module.exports = mongoose.model('ShortFilm', shortFilmSchema)
