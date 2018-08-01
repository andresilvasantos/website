const mongoose = require('mongoose')

const globalSettingsSchema = mongoose.Schema({
    backgrounds: {
        codeprojects: { type: String, required: true, trim: true },
        electronicmusic: { type: String, required: true, trim: true },
        movies: { type: String, required: true, trim: true },
        music: { type: String, required: true, trim: true },
        photography: { type: String, required: true, trim: true },
        shortfilms: { type: String, required: true, trim: true },
        tvshows: { type: String, required: true, trim: true },
        videogames: { type: String, required: true, trim: true }
    }
},
{
	timestamps: true
})

const GlobalSettings = module.exports = mongoose.model(
    'GlobalSettings',
    globalSettingsSchema
)
