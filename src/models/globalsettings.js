const mongoose = require('mongoose')

const globalSettingsSchema = mongoose.Schema({
    codeprojects: {
        background: { type: String, trim: true },
        description: { type: String, trim: true }
    },
    electronicmusic: {
        background: { type: String, trim: true },
        description: { type: String, trim: true }
    },
    movies: {
        background: { type: String, trim: true },
        description: { type: String, trim: true }
    },
    music: {
        background: { type: String, trim: true },
        description: { type: String, trim: true }
    },
    photography: {
        background: { type: String, trim: true },
        description: { type: String, trim: true }
    },
    shortfilms: {
        background: { type: String, trim: true },
        description: { type: String, trim: true }
    },
    tvshows: {
        background: { type: String, trim: true },
        description: { type: String, trim: true }
    },
    videogames: {
        background: { type: String, trim: true },
        description: { type: String, trim: true }
    }
},
{
	timestamps: true
})

const GlobalSettings = module.exports = mongoose.model(
    'GlobalSettings',
    globalSettingsSchema
)
