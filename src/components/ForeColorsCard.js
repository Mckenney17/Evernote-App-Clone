import React, { useRef } from 'react'
import './ForeColorsCard.scss'
import useSelectionDrop from '../hooks/useSelectionDrop';
import { motion } from 'framer-motion';

function ForeColorsCard({ toolsState, setToolsState, setSelectionDropTool, selColor }) {
    const cardRef = useRef(null)
    useSelectionDrop({ cardRef, exSelector: 'fore-color', setSelectionDropTool })

    return (
        <motion.div className="fore-colors-card" ref={cardRef} animate={{ y: 10, opacity: 1, type: 'tween' }}>
            <button className={!selColor.fore ? 'checked' : ''}><span></span>Auto</button>
            <ul>
                {['#333', '#5a5a5a', '#8c8c8c', '#bfbfbf', '#fff', '#5724c2', '#B629D4', '#fc1233', '#fb5f2c', '#e59e25', '#18a841', '#1aa9b2', '#1885e2', '#0d2a99']
                .map((color) => <li key={color}><button className={ selColor.fore === color ? 'checked' : '' } style={{ background: color }}></button></li>)}
            </ul>
        </motion.div>
    )
}

export default ForeColorsCard
