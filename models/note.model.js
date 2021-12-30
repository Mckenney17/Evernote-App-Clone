const mongoose = require('mongoose')

const Schema = mongoose.Schema

const NoteSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    bodyText: {
        type: String,
        required: false,
    },
    summaryText: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Number,
        required: true,
    },
    updatedAt: {
        type: Number,
        required: true,
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
})

module.exports = mongoose.model('Note', NoteSchema)
