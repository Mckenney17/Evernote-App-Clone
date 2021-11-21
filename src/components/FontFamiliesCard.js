import { motion } from 'framer-motion'
import React, { useRef } from 'react'
import useSelectionDrop from '../hooks/useSelectionDrop'
import './FontFamiliesCard.scss'

function FontFamiliesCard({ setSelectionDropTool, toolsState, setToolsState }) {
    const cardRef = useRef(null)
    useSelectionDrop({ cardRef, exSelector: 'font-family', setSelectionDropTool })

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
