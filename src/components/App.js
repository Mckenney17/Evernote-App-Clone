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
    const [notes, setNotes] = useState([
        { id: '1', title: 'Untitled', bodyText: 'Nothing here...', createdAt: new Date().valueOf(), updatedAt: new Date().valueOf() },
        { id: '2', title: 'Untitled', bodyText: 'Something here...', createdAt: new Date().valueOf() + 2, updatedAt: new Date().valueOf() + 1 },
        { id: '3', title: 'Untitled', bodyText: 'Somenothing here...', createdAt: new Date().valueOf() + 4, updatedAt: new Date().valueOf() + 2 },
    ]);
    const [activeNote, setActiveNote] = useState(notes.find((obj) => obj.updatedAt === Math.max(...notes.map((obj) => obj.updatedAt))).id)
    const updateNotes = (updatedNotes) => {
        setNotes(updatedNotes)
    }

    return (
        <AppContext.Provider value={{ activeTab, setActiveTab, notes, updateNotes, activeNote, setActiveNote }}>
            <div className="app-wrapper">
                <Sidebar />
                <Notelist />
                <Editor/>
            </div>
        </AppContext.Provider>
    )
}

export default App
