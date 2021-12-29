import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import AppContext from '../utils/AppContext'
import './Home.scss'
import Editor from './Editor'
import Notelist from './Notelist'
import Sidebar from './Sidebar'

// sidebar
// notelist
// editor

function Home({ match }) {
    const lastAssignedId = useRef(parseInt(localStorage.getItem('kennote-lastAssignedId')) || 0)
    const [activeNotelist, setActiveNotelist] = useState('Notes');
    const [activeNotebook] =  useState('First Notebook')
    const [trash, setTrash] = useState([])
    const [isToplistView, setIsToplistView] = useState(false)
    const [notes, setNotes] = useState([]);
    const [activeNoteId, setActiveNoteId] = useState('')
    const [user, setUser] = useState(null)

    useEffect(() => {
        (async () => {
            const session = await axios.get('/session')
            if (session.data.user._id !== match.params.userId) {
                window.location.pathname = '/'
                return
            }
            setUser(session.data.user)
        })()
    }, [match.params.userId])

    return (
        <AppContext.Provider value = {{
            activeNotelist,
            setActiveNotelist,
            notes,
            activeNotebook,
            trash,
            setNotes,
            lastAssignedId,
            activeNoteId,
            setActiveNoteId,
            setIsToplistView,
            setTrash,
            user,
        }}>
            <div className="app-wrapper">
                <Sidebar />
                <div className={`notelist-with-editor ${isToplistView ? 'top-list-view-active' : ''}`}>
                    <Notelist />
                    {/* <Editor/> */}
                </div>
            </div>
        </AppContext.Provider>
    )
}

export default Home
