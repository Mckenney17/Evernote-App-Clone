import React, { useState, useRef } from 'react'
import AppContext from '../utils/AppContext'
import './App.scss'
import Editor from './Editor'
import Notelist from './Notelist'
import Sidebar from './Sidebar'

// sidebar
// notelist
// editor

function App() {
    const lastAssignedId = useRef(parseInt(localStorage.getItem('kennote-lastAssignedId')) || 0)
    const [activeNotelist, setActiveNotelist] = useState('Notes');
    const [activeNotebook] =  useState('First Notebook')
    const [trash, setTrash] = useState(JSON.parse(localStorage.getItem('kennote-trash')) || [])
    const [isToplistView, setIsToplistView] = useState(false)
    const [notebooks, setNotebooks] = useState(JSON.parse(localStorage.getItem('kennote-notebooks')) || {});
    const [activeNoteId, setActiveNoteId] = useState((notebooks[activeNotebook] || []).find((obj) => obj.updatedAt === Math.max(...notebooks[activeNotebook].map((obj) => obj.updatedAt)))?.id)
    

    
    

    return (
        <AppContext.Provider value = {{
            activeNotelist,
            setActiveNotelist,
            notebooks,
            activeNotebook,
            trash,
            setNotebooks,
            lastAssignedId,
            activeNoteId,
            setActiveNoteId,
            setIsToplistView,
            setTrash,
        }}>
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
