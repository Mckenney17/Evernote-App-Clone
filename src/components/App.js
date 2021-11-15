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
        { id: '1', title: 'Untitled', bodyText: 'Nothing here...', createdAt: new Date().valueOf() + 8, updatedAt: new Date().valueOf() + 4 },
        { id: '2', title: 'Untitled', bodyText: 'Something here...', createdAt: new Date().valueOf() + 6, updatedAt: new Date().valueOf() + 3 },
        { id: '3', title: 'Untitled', bodyText: 'Somenothing here...', createdAt: new Date().valueOf() + 4, updatedAt: new Date().valueOf() + 2 },
        { id: '4', title: 'Untitled', bodyText: 'Hi there...', createdAt: new Date().valueOf() + 2, updatedAt: new Date().valueOf() + 1 },
    ]);
    const [activeNote, setActiveNote] = useState(notes.find((obj) => obj.updatedAt === Math.max(...notes.map((obj) => obj.updatedAt))).id)
    const updateNotes = (updatedNotes) => {
        setNotes(updatedNotes)
    }

    return (
        <AppContext.Provider value={{ activeTab, setActiveTab, notes, updateNotes, activeNote, setActiveNote, setIsToplistView }}>
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
