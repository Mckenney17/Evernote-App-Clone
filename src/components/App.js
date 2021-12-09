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

    const createNewNote = () => {
        lastAssignedId.current++
        localStorage.setItem('kennote-lastAssignedId', lastAssignedId.current)
        setNotebooks((previousNotebooks) => {
            const clonePNB = {...previousNotebooks}
            if (clonePNB[activeNotebook]) {
                clonePNB[activeNotebook].push({id: lastAssignedId.current, title: 'Untitled', bodyText: '', summaryText: '', createdAt: Date.now(), updatedAt: Date.now() })
                return clonePNB
            }
            return {...clonePNB, [activeNotebook]: [{id: lastAssignedId.current, title: 'Untitled', bodyText: '', summaryText: '', createdAt: Date.now(), updatedAt: Date.now() }]}
        })
        setActiveNoteId(lastAssignedId.current)
        if (activeNotelist === 'Trash') {
            setActiveNotelist('Notes')
        }
    }

    const addToTrash = (noteId) => {
        setNotebooks((previousNotebooks) => {
            const clonePNB = {...previousNotebooks}
            const indexOfNote = clonePNB[activeNotebook].findIndex((obj) => obj.id === noteId)
            const deletedNote = clonePNB[activeNotebook].splice(indexOfNote, 1)[0]
            setTrash((prevTrash) => [...prevTrash, {...deletedNote, belongsTo: activeNotebook}])
            return clonePNB
        })
    } 
    
    useEffect(() => {
        localStorage.setItem('kennote-notebooks', JSON.stringify(notebooks))
    }, [notebooks])

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
        < AppContext.Provider value = {
            {
                activeNotelist,
                setActiveNotelist,
                notebooks,
                activeNotebook,
                trash,
                addToTrash,
                updateNotes,
                createNewNote,
                activeNoteId,
                setActiveNoteId,
                setIsToplistView,
                editingActive,
                setEditingActive,
            }
        } >
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
