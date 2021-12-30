import React, { useState, useContext, useEffect, useCallback } from 'react'
import axios from 'axios'
import AppContext from '../utils/AppContext'
import AuthContext from '../utils/AuthContext'
import './Home.scss'
import Editor from './Editor'
import Notelist from './Notelist'
import Sidebar from './Sidebar'
import Spinner from './Spinner'

// sidebar
// notelist
// editor

function Home({ match }) {
    const [activeNotelist, setActiveNotelist] = useState('Notes');
    const [activeNotebook] =  useState('First Notebook')
    const [trash, setTrash] = useState([])
    const [isToplistView, setIsToplistView] = useState(false)
    const [notes, setNotes] = useState([]);
    const [activeNoteId, setCurrentActiveNoteId] = useState('')
    const [prevActiveNoteId, setPrevActiveNoteId] = useState('')
    const [user, setUser] = useState(null)
    const { setCsrfToken, csrfToken, pageReady, setPageReady } = useContext(AuthContext)
    const [notelistReady, setNotelistReady] = useState(false)

    useEffect(() => {
        (async () => {
            setPageReady(false)
            const session = await axios.get('/session')
            if (!session.data.user || session.data.user._id !== match.params.userId) {
                window.location.pathname = '/'
                return
            }
            const authRes = await axios.get('/auth_token')
            const { csrfToken } = authRes.data
            setCsrfToken(csrfToken)
            setUser(session.data.user)
            setPageReady(true)
        })()
    }, [match.params.userId, setCsrfToken, setPageReady])

    const setActiveNoteId = useCallback((id) => {
        setCurrentActiveNoteId((prevActiveNoteId) => {
            setPrevActiveNoteId(prevActiveNoteId)
            return id
        })
    }, [])

    useEffect(() => {
        if (!prevActiveNoteId) return
        (async () => {
            const { title, bodyText, summaryText, updatedAt } = notes.find((obj) => obj._id === prevActiveNoteId)
            await axios.put(`/update_note/${prevActiveNoteId}`, { _csrf: csrfToken, title, bodyText, summaryText, updatedAt })
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prevActiveNoteId])

    

    return (
        <AppContext.Provider value = {{
            activeNotelist,
            setActiveNotelist,
            notes,
            activeNotebook,
            trash,
            setNotes,
            activeNoteId,
            setActiveNoteId,
            setIsToplistView,
            setTrash,
            user,
            notelistReady,
            setNotelistReady,
        }}>
            {pageReady ?
            <div className="app-wrapper">
                <Sidebar />
                <div className={`notelist-with-editor ${isToplistView ? 'top-list-view-active' : ''}`}>
                    <Notelist />
                    <Editor/>
                </div>
            </div>
            : <Spinner />}
        </AppContext.Provider>
    )
}

export default Home
