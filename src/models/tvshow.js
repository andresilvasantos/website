const mongoose = require('mongoose')

const tvShowSchema = mongoose.Schema({
    genres: [{type: String}],
    imageUrl: { type: String, required: true, trim: true },
    imdbId: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    vote: { type: Number, min: 1, max: 10 }
},
{
	timestamps: true
})

const TvShow = module.exports = mongoose.model('TvShow', tvShowSchema)
