import React, { useRef } from 'react'
import './BackColorsCard.scss'
import useSelectionDrop from '../hooks/useSelectionDrop';
import { motion } from 'framer-motion';

function BackColorsCard({ setSelectionDropTool , selColor, setSelColor }) {
    const cardRef = useRef(null)
    useSelectionDrop({ cardRef, exSelector: 'back-color', setSelectionDropTool })

    return (
        <motion.div className="back-colors-card" ref={cardRef} animate={{ y: 10, opacity: 1, type: 'tween' }}>
            <ul>
                {['#ffef9e', '#fec1d0', '#b7f7d1', '#adecf4', '#cbcaff', '#ffd1b0']
                .map((color) => <li key={color}><button onClick={() => setSelColor((prev) =>({...prev, back: color, selBack: color}))} className={ selColor.back === color ? 'checked' : '' } style={{ background: color }}></button></li>)}
            </ul>
        </motion.div>
    )
}

export default BackColorsCard
