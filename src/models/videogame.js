const mongoose = require('mongoose')

const videoGameSchema = mongoose.Schema({
    genres: [{type: String}],
    imageUrl: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, unique: true, trim: true }
},
{
	timestamps: true
})

const VideoGame = module.exports = mongoose.model('VideoGame', videoGameSchema)
