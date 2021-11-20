import { motion } from 'framer-motion'
import React, { useEffect, useRef } from 'react'
import { allDocument } from '../utils/utilFuncs'
import './FontFamiliesCard.scss'

function FontFamiliesCard({ setSelectionDropTool, toolsState, setToolsState }) {
    const cardRef = useRef(null)
    useEffect(() => {
        const disappear = (ev) => {
            if (!ev.path.includes(cardRef.current)) {
                const otherEditTools = document.querySelectorAll('.tool-bar button:not(.font-family)')
                if ([...otherEditTools].some((elem) => ev.path.includes(elem))) return
                setSelectionDropTool({ tool: null })
                return
            }
        }
        allDocument.addEventListener('click', disappear)

        return () => {
            allDocument.removeEventListener('click', disappear)
        }
    }, [setSelectionDropTool])
    return (
        <motion.div className="font-families-card" ref={cardRef} animate={{ y: 10, opacity: 1, type: 'tween' }}>
            <ul>
            {[['Sans serif', 'Source Sans Pro'], ['Serif', 'Source Serif Pro'], ['Slab serif', 'Zilla Slab'], ['Monospace', 'Source Code Pro'], ['Script', 'Dancing Script'], ['Handwritten', 'Kalam']].map(([superFamily, fontFamily]) => (
                <li key={superFamily} className={toolsState.fontFamily === superFamily ? 'checked' : ''}>
                    <button style={{ fontFamily }}>{superFamily}</button>
                </li>
            ))}
            </ul>
        </motion.div>
    )
}

export default FontFamiliesCard
