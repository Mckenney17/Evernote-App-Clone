import { motion } from 'framer-motion'
import React, { useContext, useEffect, useRef } from 'react'
import AppContext from '../utils/AppContext'
import { allDocument } from '../utils/utilFuncs'
import './NoteOptionsCard.scss'

function NoteOptionsCard({ setNoteOptionsCardActive, noteOptionsBtn }) {
    const { activeNoteId, moveToTrash, activeNotebook, activeNotelist, trash, restore, permDelete } = useContext(AppContext)
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
