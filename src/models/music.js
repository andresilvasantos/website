const mongoose = require('mongoose')

const musicSchema = mongoose.Schema({
    genres: [{type: String}],
    title: { type: String, required: true, trim: true },
    youtubeId: { type: String, required: true, unique: true, trim: true }
},
{
	timestamps: true
})

const Music = module.exports = mongoose.model('Music', musicSchema)
