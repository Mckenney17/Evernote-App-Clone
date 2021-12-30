const Note = require("../models/note.model")
const Notes = require("../models/note.model")
const Notebook = require("../models/notebook.model")

exports.getNotes = async (req, res) => {
    try {
        const { category } = req.params
        if (category === 'allNotes') {
            const notes = await Notes.find({ ownerId: req.user._id })
            res.json({ noteItems: notes.map((note) => note._doc) })
        }
    } catch (e) {
        console.log(e)
    }
}

exports.addNewNote = async (req, res) => {
    try {
        const { notebook: notebookName } = req.params
        const { _csrf, ...mainData } = req.body
        const newNote = new Note(mainData)
        const lastAddedNote = await newNote.save()
        const notebook = await Notebook.findOne({ name: notebookName })
        await notebook.addNote(lastAddedNote)
        res.json({ lastAddedNote: lastAddedNote._doc })
    } catch (e) {
        console.log(e)
    }
}

exports.updateNote = async (req, res) => {
    try {
        const { noteId } = req.params
        const { title, bodyText, summaryText, updatedAt } = req.body
        await Note.findOneAndUpdate({ _id: noteId, ownerId: req.user._id}, { title, bodyText, summaryText, updatedAt }, { useFindAndModify: false })
        res.json({ successMessage: 'Update Successful' })
    } catch (e) {
        console.log(e)
    }
}