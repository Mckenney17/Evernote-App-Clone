const Note = require("../models/note.model")
const Notes = require("../models/note.model")
const Notebook = require("../models/notebook.model")

const modNote = (note) => ({ ...note, updatedAt: new Date(note.updatedAt).valueOf(), createdAt: new Date(note.createdAt).valueOf() })


exports.getNotes = async (req, res) => {
    try {
        const { category } = req.params
        if (category === 'allNotes') {
            const notes = await Notes.find({ ownerId: req.user._id })
            res.json({ noteItems: notes.map((note) => modNote(note._doc)) })
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
        res.json({ lastAddedNote: modNote(lastAddedNote._doc) })
    } catch (e) {
        console.log(e)
    }
}