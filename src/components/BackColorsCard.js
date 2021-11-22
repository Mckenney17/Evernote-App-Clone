import React, { useRef } from 'react'
import './BackColorsCard.scss'
import useSelectionDrop from '../hooks/useSelectionDrop';
import { motion } from 'framer-motion';

function BackColorsCard({ toolsState, setToolsState, setSelectionDropTool }) {
    const { backColor } = toolsState;
    const cardRef = useRef(null)
    useSelectionDrop({ cardRef, exSelector: 'back-color', setSelectionDropTool })

    return (
        <motion.div className="back-colors-card" ref={cardRef} animate={{ y: 10, opacity: 1, type: 'tween' }}>
            <ul>
                {['#ffef9e', '#fec1d0', '#b7f7d1', '#adecf4', '#cbcaff', '#ffd1b0']
                .map((color) => <li key={color}><button className={ backColor === color ? 'checked' : '' } style={{ background: color }}></button></li>)}
            </ul>
        </motion.div>
    )
}

export default BackColorsCard
