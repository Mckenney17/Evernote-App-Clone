import { motion } from 'framer-motion'
import React, { useEffect, useRef } from 'react'
import { allDocument } from '../utils/utilFuncs'
import './TextLevelCard.scss'

function TextLevelsCard({ setSelectionDropTool }) {
    const cardRef = useRef(null)
    useEffect(() => {
        const disappear = (ev) => {
            if (!ev.path.includes(cardRef.current)) {
                const otherEditTools = document.querySelectorAll('.tool-bar button:not(.text-level)')
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
