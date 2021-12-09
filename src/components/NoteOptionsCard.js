import { motion } from 'framer-motion'
import React, { useEffect, useRef } from 'react'
import { allDocument } from '../utils/utilFuncs'
import './NoteOptionsCard.scss'

function NoteOptionsCard({ setNoteOptionsCardActive, noteOptionsBtn }) {
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
    return (
        <motion.div className="note-options-card" animate={{ y: 10, opacity: 1, type: 'tween' }}>
            <ul>
                <li><button onClick={() => setNoteOptionsCardActive(false)}>Move to Trash</button></li>
            </ul>
        </motion.div>
    )
}

export default NoteOptionsCard
