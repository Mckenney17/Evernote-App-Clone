const mongoose = require('mongoose')

const Schema = mongoose.Schema

const NotebookSchema =  new Schema({
    name: {
        type: String,
        required: true,
    },
    notes: [
        {
            noteId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'Note',
            }
        }
    ],
    notesQuantity: {
        type: Number,
        required: true,
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }
})

NotebookSchema.methods = {
    async addNote(note) {
        const updatedNotes = [...this.notes, { noteId: note._id }]
        this.notesQuantity = updatedNotes.length
        this.notes = updatedNotes
        await this.save()
    }
}

module.exports = mongoose.model('Notebook', NotebookSchema)