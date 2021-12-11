import { motion } from 'framer-motion'
import React, { useContext, useEffect, useRef } from 'react'
import AppContext from '../utils/AppContext'
import { allDocument } from '../utils/utilFuncs'
import './NoteOptionsCard.scss'

function NoteOptionsCard({ setNoteOptionsCardActive, noteOptionsBtn }) {
    const { activeNoteId, activeNotebook, activeNotelist, trash, setActiveNoteId, setNotebooks, setTrash, notebooks } = useContext(AppContext)
    const cardRef = useRef(null)
    useEffect(() => {
        const disappear = (ev) => {
            if (!ev.path.includes(cardRef.current)) {
                if (ev.path.includes(noteOptionsBtn)) return
                setNoteOptionsCardActive(false)
                return
            }
        }
        allDocument.addEventListener('click', disappear)

        return () => {
            allDocument.removeEventListener('click', disappear)
        }
    }, [noteOptionsBtn, setNoteOptionsCardActive])

    const moveToTrash = (noteId, notebook) => {
        setNotebooks((previousNotebooks) => {
            const clonePNB = {...previousNotebooks}
            const indexOfNote = clonePNB[notebook].findIndex((obj) => obj.id === noteId)
            const deletedNote = clonePNB[notebook].splice(indexOfNote, 1)[0]
            setTrash((prevTrash) => [...prevTrash, {...deletedNote, belongsTo: notebook, trashedAt: Date.now()}])
            return clonePNB
        })
        setActiveNoteId((notebooks[activeNotebook] || []).find((obj) => obj.updatedAt === Math.max(...notebooks[activeNotebook].map((obj) => obj.updatedAt)))?.id)
    }

    const restore = (noteId) => {
        setTrash((prevTrash) => {
            const cloneTrash = [...prevTrash]
            const indexOfNote = cloneTrash.findIndex((obj) => obj.id === noteId)
            const restoredNote = cloneTrash.splice(indexOfNote, 1)[0]
            const {belongsTo: ownerNotebook, trashedAt, ...note} = restoredNote
            setNotebooks((previousNotebooks) => ({...previousNotebooks, [ownerNotebook]: [...previousNotebooks[ownerNotebook], note]}))
            return cloneTrash
        })
        if (trash.length) {
            setActiveNoteId(trash.find((obj) => obj.trashedAt === Math.max(...trash.map((obj) => obj.trashedAt)))?.id)
        }
    }

    const permDelete = (noteId) => {
        setTrash((prevTrash) => {
            const cloneTrash = [...prevTrash]
            const indexOfNote = cloneTrash.findIndex((obj) => obj.id === noteId)
            cloneTrash.splice(indexOfNote, 1)
            if (cloneTrash.length) {
                setActiveNoteId(trash.find((obj) => obj.trashedAt === Math.max(...trash.map((obj) => obj.trashedAt)))?.id)
            } else {
                setActiveNoteId((notebooks[activeNotebook] || []).find((obj) => obj.updatedAt === Math.max(...notebooks[activeNotebook].map((obj) => obj.updatedAt)))?.id)
            }
            return cloneTrash
        })
    }

    const handleNoteOptionClick = (ev, option) => {
        if (option === 'Move to Trash') {
            moveToTrash(activeNoteId, activeNotebook)
        } else if (option === 'Restore') {
            restore(activeNoteId)
        } else if (option === 'Delete') {
            permDelete(activeNoteId)
        }
        setNoteOptionsCardActive(false)
    }

    return (
        <motion.div className="note-options-card" animate={{ y: 10, opacity: 1, type: 'tween' }}>
            {activeNotelist !== 'Trash' || !trash.length ?
            <ul>
                {['Move to Trash'].map((option) => {
                    return <li key={option}><button onClick={(ev) => handleNoteOptionClick(ev, option)}>{option}</button></li>
                })}
            </ul>
            : <ul>
                {['Restore', 'Delete'].map((option) => {
                    return <li key={option}><button data-option={option} onClick={(ev) => handleNoteOptionClick(ev, option)}>{option}</button></li>
                })}
            </ul>}
        </motion.div>
    )
}

export default NoteOptionsCard
