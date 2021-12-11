import React, { useEffect, useState, useRef } from 'react'
import AppContext from '../utils/AppContext'
import './App.scss'
import Editor from './Editor'
import Notelist from './Notelist'
import Sidebar from './Sidebar'

// sidebar
// notelist
// editor

function App() {
    const [editingActive, setEditingActive] = useState(true)

    const lastAssignedId = useRef(parseInt(localStorage.getItem('kennote-lastAssignedId')) || 0)
    const [activeNotelist, setActiveNotelist] = useState('Notes');
    const [activeNotebook] =  useState('First Notebook')
    const [trash, setTrash] = useState(JSON.parse(localStorage.getItem('kennote-trash')) || [])
    const [isToplistView, setIsToplistView] = useState(false)
    const [notebooks, setNotebooks] = useState(JSON.parse(localStorage.getItem('kennote-notebooks')) || {});
    const [activeNoteId, setActiveNoteId] = useState((notebooks[activeNotebook] || []).find((obj) => obj.updatedAt === Math.max(...notebooks[activeNotebook].map((obj) => obj.updatedAt)))?.id)
    const updateNotes = (updatedNote) => {
        setNotebooks((previousNotebooks) => {
            const clonePNB = {...previousNotebooks}
            const indexOfNote = clonePNB[activeNotebook].findIndex((obj) => obj.id === activeNoteId)
            clonePNB[activeNotebook][indexOfNote] = updatedNote
            return clonePNB
        })
    }

    const emptyTrash = () => {
        setTrash([])
        setActiveNoteId((notebooks[activeNotebook] || []).find((obj) => obj.updatedAt === Math.max(...notebooks[activeNotebook].map((obj) => obj.updatedAt)))?.id)
    }
    
    useEffect(() => {
        localStorage.setItem('kennote-notebooks', JSON.stringify(notebooks))
        localStorage.setItem('kennote-trash', JSON.stringify(trash))
    }, [notebooks, trash])

    useEffect(() => {
        const deactivateEditing = (ev) => {
            const editorArea = document.querySelector('.editor');
            if (!ev.path.includes(editorArea)) setEditingActive(false)
        }
        document.addEventListener('click', deactivateEditing)
        return () => {
            document.removeEventListener('click', deactivateEditing)
        }
    }, [])

    return (
        <AppContext.Provider value = {{
            activeNotelist,
            setActiveNotelist,
            notebooks,
            activeNotebook,
            trash,
            updateNotes,
            setNotebooks,
            lastAssignedId,
            activeNoteId,
            setActiveNoteId,
            setIsToplistView,
            editingActive,
            setEditingActive,
            emptyTrash,
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
