import { motion } from 'framer-motion'
import React, { useRef } from 'react'
import useSelectionDrop from '../hooks/useSelectionDrop'
import './TextLevelCard.scss'

function TextLevelsCard({ setSelectionDropTool }) {
    const cardRef = useRef(null)
    useSelectionDrop({ cardRef, exSelector: 'text-level', setSelectionDropTool })
    /* 
    Large Heading 30px
    Medium Heading 24px
    Small Headinng 18px
    Normal Text 14px
     */
    return (
        <motion.div className="text-level-card" ref={cardRef} animate={{ y: 10, opacity: 1, type: 'tween' }}>
            <ul>
            {[<h1>Large heading</h1>, <h2>Medium Heading</h2>, <h3>Small Heading</h3>, 'Normal Text'].map((v, i) => (
                <li key={`tl-${i}`}><button>{v}</button></li>
            ))}
            </ul>
        </motion.div>
    )
}

export default TextLevelsCard
