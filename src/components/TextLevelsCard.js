import { motion } from 'framer-motion'
import React, { useRef } from 'react'
import useSelectionDrop from '../hooks/useSelectionDrop'
import './TextLevelCard.scss'

function TextLevelsCard({ setSelectionDropTool }) {
    const cardRef = useRef(null)
    useSelectionDrop({ cardRef, exSelector: 'text-level', setSelectionDropTool })

    return (
        <motion.div className="text-level-card" ref={cardRef} animate={{ y: 10, opacity: 1, type: 'tween' }}>
            <ul>
            {[<h1>Heading Text</h1>, <h3>Sub-heading Text</h3>, 'Normal Text'].map((v, i) => (
                <li key={`tl-${i}`}><button>{v}</button></li>
            ))}
            </ul>
        </motion.div>
    )
}

export default TextLevelsCard
