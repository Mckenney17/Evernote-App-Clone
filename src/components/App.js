import React, { useState } from 'react'
import AppContext from '../utils/AppContext'
import './App.scss'
import Editor from './Editor'
import Notelist from './Notelist'
import Sidebar from './Sidebar'

// sidebar
// notelist
// editor

function App() {
    const [activeTab, setActiveTab] = useState('Notes');
    const [isToplistView, setIsToplistView] = useState(false)
    const [notes, setNotes] = useState([
        { id: '1', title: 'Untitled', bodyText: '', createdAt: new Date().valueOf() + 8, updatedAt: new Date().valueOf() + 4 },
        { id: '2', title: 'Some title', bodyText: 'Something here...', createdAt: new Date().valueOf() + 6, updatedAt: new Date().valueOf() + 3 },
    ]);
    const [activeNoteId, setActiveNoteId] = useState(notes.find((obj) => obj.updatedAt === Math.max(...notes.map((obj) => obj.updatedAt))).id)
    const updateNotes = (updatedNote : Object) => {
        setNotes((previousNotes) => {
            const clonePN = [...previousNotes]
            const indexOfNote = clonePN.findIndex((obj) => obj.id === activeNoteId)
            clonePN[indexOfNote] = updatedNote
            return clonePN
        })
    }

    return (
        <AppContext.Provider value={{ activeTab, setActiveTab, notes, updateNotes, activeNoteId, setActiveNoteId, setIsToplistView }}>
            <div className="app-wrapper">
                <Sidebar />
                <div className={`notelist-with-editor ${isToplistView ? 'top-list-view-active' : ''}`}>
                    <Notelist />
                    <Editor/>
                </div>
            </div>
        </AppContext.Provider>
    )
}

export default App
