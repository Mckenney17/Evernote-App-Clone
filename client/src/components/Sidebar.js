import { motion } from 'framer-motion'
import axios from 'axios'
import React, { useContext, useEffect } from 'react'
import AppContext from '../utils/AppContext'
import AuthContext from '../utils/AuthContext'
import { camelCase } from '../utils/utilFuncs'
import Search from './Search'
import './Sidebar.scss'

function Sidebar() {
    const { setActiveNotelist, activeNotelist, setNotes, setActiveNoteId, notes, activeNotebook, trash, user } = useContext(AppContext)
    const { setCsrfToken, setPageReady, csrfToken } = useContext(AuthContext)
    useEffect(() => {
        (async () => {
            const authRes = await axios.get('/auth_token')
            const { csrfToken } = authRes.data
            setCsrfToken(csrfToken)
            setPageReady(true)
        })()
    }, [setCsrfToken, setPageReady])

    const handleResizerDrag = (ev, info) => {
        document.querySelector('.sidebar').style.width = `${info.point.x}px`
    }

    const handleDragEnd = () => {
        setTimeout(() => {
            document.querySelector('.sidebar-resizer').style.transform = 'none'
        }, 50)
    }

    const handleNavigation = (ev, notelistLabel) => {
        ev.preventDefault()
        setActiveNotelist(notelistLabel)
        if (notelistLabel !=='Trash') {
            setActiveNoteId(notes.find((obj) => obj.updatedAt === Math.max(...notes.map((obj) => obj.updatedAt)))?._id);
        } else if (trash.length) {
            setActiveNoteId(trash.find((obj) => obj.trashedAt === Math.max(...trash.map((obj) => obj.trashedAt)))?._id)
        }
    }

    const createNewNote = async () => {
        // post note to database
        const res = await axios.post(`/add_new_note/${camelCase(activeNotebook)}`, {
            _csrf: csrfToken,
            ownerId: user._id,
            title: 'Untitled',
            bodyText: '',
            summaryText: '',
        })
        const { lastAddedNote } = res.data
        // get last added note from database = note from server
        setNotes((previousNotes) => [...previousNotes, lastAddedNote])
        setActiveNoteId(lastAddedNote._id)
        if (activeNotelist === 'Trash') {
            setActiveNotelist('Notes')
        }
    }

    return (
        <div className="sidebar">
            <motion.span className="sidebar-resizer" drag='x' onDrag={handleResizerDrag} dragMomentum={false} onDragEnd={handleDragEnd}></motion.span>
            <div className="top-section-search-newnote">
                <Search />
                <button onClick={() => createNewNote()} className="newnote">
                    <div className="add-newnote">
                        <span className="add-icon">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM11 9v2H9a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V9a1 1 0 10-2 0z"></path></svg>
                        </span>
                    </div>
                    <span>New Note</span>
                </button>
            </div>
            <div className="menu-section">
                <nav role="menubar">
                    <a onClick={(ev) => handleNavigation(ev, 'Notes')} className={activeNotelist === 'Notes' ? 'active' : ''} role="navigation" href="/">
                        <span className="note-icon">
                            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M7.665 4.5h8.75c.92 0 1.667.746 1.667 1.667v8.748h-3.334a.625.625 0 00-.625.624v3.958H7.665c-.92 0-1.667-.747-1.667-1.667V6.167c0-.92.747-1.667 1.667-1.667zm7.037 4.584a.625.625 0 100-1.25H9.298a.625.625 0 100 1.25h5.404zm.625 2.918c0 .345-.28.625-.625.625H9.298a.625.625 0 010-1.25h5.404c.345 0 .625.28.625.625zm-4.363 4.158a.625.625 0 100-1.25H9.298a.625.625 0 100 1.25h1.666z" fill="currentColor"></path><path d="M15.373 16.164h2.157l-2.107 2.693-.05.06v-2.753z" fill="currentColor"></path></svg>
                        </span>
                        <span>Notes</span>
                    </a>
                    <a onClick={(ev) => handleNavigation(ev, 'Trash')} className={activeNotelist === 'Trash' ? 'active' : ''} role="navigation" href="/">
                        <span className="trash-icon">
                            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.298 17.93l.494-8.846H7.208l.514 8.85c.05.88.78 1.57 1.664 1.57h5.248c.885 0 1.615-.692 1.664-1.575z" fill="currentColor"></path><path fillRule="evenodd" clipRule="evenodd" d="M11.167 4.087a2.292 2.292 0 00-2.292 2.291v.205H5.75a.625.625 0 100 1.25h12.5a.625.625 0 100-1.25h-3.125v-.205a2.292 2.292 0 00-2.292-2.291h-1.666zm2.708 2.496v-.205c0-.575-.466-1.041-1.042-1.041h-1.666c-.576 0-1.042.466-1.042 1.041v.205h3.75z" fill="currentColor"></path></svg>
                        </span>
                        <span>Trash</span>
                    </a>
                </nav>
            </div>
        </div>
    )
}

export default Sidebar
