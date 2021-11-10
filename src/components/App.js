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
    const [notelistView, setNotelistView] = useState({ view: 'Snippets', checks: ['Show images', 'Show body text'] })
    const [notes, setNotes] = useState([]);

    const updateNotes = (updatedNotes) => {
        setNotes(updatedNotes)
    }

    return (
        <AppContext.Provider value={{ activeTab, setActiveTab, notelistView, setNotelistView, notes, updateNotes }}>
            <div className="app-wrapper">
                <Sidebar />
                <Notelist />
                <Editor/>
            </div>
        </AppContext.Provider>
    )
}

export default App
