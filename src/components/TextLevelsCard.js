import { motion } from 'framer-motion'
import React, { useRef } from 'react'
import useSelectionDrop from '../hooks/useSelectionDrop'
import './TextLevelCard.scss'

function TextLevelsCard({ setSelectionDropTool, format }) {
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
            {['Large heading', 'Medium heading', 'Small heading', 'Normal text'].map((v, i) => (
                <li key={`tl-${i}`}><button onClick={() => format(v)}>{v}</button></li>
            ))}
            </ul>
        </motion.div>
    )
}

export default TextLevelsCard
