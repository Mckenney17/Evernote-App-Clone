import { motion } from 'framer-motion'
import React, { useRef } from 'react'
import useSelectionDrop from '../hooks/useSelectionDrop'
import { hyphenate } from '../utils/utilFuncs'
import './FontFamiliesCard.scss'

function FontFamiliesCard({ setSelectionDropTool, toolsState, setToolsState }) {
    const cardRef = useRef(null)
    useSelectionDrop({ cardRef, exSelector: 'font-family', setSelectionDropTool })

    return (
        <motion.div className="font-families-card" ref={cardRef} animate={{ y: 10, opacity: 1, type: 'tween' }}>
            <ul>
            {['Sans serif', 'Serif', 'Slab serif', 'Monospace', 'Script', 'Handwritten'].map((superFamily) => (
                <li key={superFamily} className={toolsState.superFamily === superFamily ? 'checked' : ''}>
                    <button className={hyphenate(superFamily)}>{superFamily}</button>
                </li>
            ))}
            </ul>
        </motion.div>
    )
}

export default FontFamiliesCard
