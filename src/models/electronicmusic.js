const mongoose = require('mongoose')

const electronicMusicSchema = mongoose.Schema({
    imageUrl: { type: String, required: true, trim: true },
    soundcloudAlias: { type: String, required: true, unique: true, trim: true },
    soundcloudId: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true }
},
{
	timestamps: true
})

const ElectronicMusic = module.exports = mongoose.model(
    'ElectronicMusic',
    electronicMusicSchema
)
