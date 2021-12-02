import React, { useEffect, useState } from 'react'
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
    const [notes, setNotes] = useState(JSON.parse(localStorage.getItem('all-notes')) || []);
    const [activeNoteId, setActiveNoteId] = useState(notes.find((obj) => obj.updatedAt === Math.max(...notes.map((obj) => obj.updatedAt)))?.id)
    const updateNotes = (updatedNote) => {
        setNotes((previousNotes) => {
            const clonePN = [...previousNotes]
            const indexOfNote = clonePN.findIndex((obj) => obj.id === activeNoteId)
            clonePN[indexOfNote] = updatedNote
            return clonePN
        })
        localStorage.setItem('all-notes', JSON.stringify(notes))
    }
    const createNewNote = () => {
        setNotes((previousNotes) => {
            const clonePN = [...previousNotes]
            clonePN.push({ id: clonePN.length + 1, title: 'Untitled', bodyText: '', summaryText: '', createdAt: Date.now(), updatedAt: Date.now() })
            return clonePN
        })
        setActiveNoteId(notes.length + 1)
    }
    
    useEffect(() => {
        localStorage.setItem('all-notes', JSON.stringify(notes))
    }, [notes])

    return (
        <AppContext.Provider value={{ activeTab, setActiveTab, notes, updateNotes, createNewNote, activeNoteId, setActiveNoteId, setIsToplistView }}>
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
