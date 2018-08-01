const mongoose = require("mongoose")

const movieSchema = mongoose.Schema({
    genres: [{type: String}],
    imageUrl: { type: String, required: true, trim: true },
    imdbId: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    vote: { type: Number, min: 1, max: 10 }
},
{
	timestamps: true
})

const Movie = module.exports = mongoose.model('Movie', movieSchema)
