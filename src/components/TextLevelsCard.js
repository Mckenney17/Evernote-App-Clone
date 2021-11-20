import { motion } from 'framer-motion'
import React from 'react'
import './TextLevelCard.scss'

function TextLevelsCard() {
    return (
        <motion.div className="text-level-card" animate={{ y: 10, opacity: 1, type: 'tween' }}>
            <ul>
            {[<h1>Heading Text</h1>, <h3>Sub-heading Text</h3>, 'Normal Text'].map((v, i) => (
                <li key={`tl-${i}`}><button>{v}</button></li>
            ))}
            </ul>
        </motion.div>
    )
}

export default TextLevelsCard
