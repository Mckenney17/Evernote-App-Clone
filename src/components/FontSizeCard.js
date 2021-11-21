import { motion } from 'framer-motion'
import React, { useRef } from 'react'
import useSelectionDrop from '../hooks/selectionDrop'
import './FontSizeCard.scss'

function FontSizeCard({ setSelectionDropTool, toolsState, setToolsState }) {
    const cardRef = useRef(null)
    useSelectionDrop({ cardRef, exSelector: 'font-size', setSelectionDropTool })
    
    return (
        <motion.div className="font-size-card" ref={cardRef} animate={{ y: 10, opacity: 1, type: 'tween' }}>
            <ul>
            {[8,9,10,12,14,16,18,20,24,30,36,48,64,72,96].map((v, i) => (
                <li key={`fz-${v}`} className={toolsState.fontSize === v ? 'checked' : ''}>
                    <button>
                        <span className="check-mark-icon">
                            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M17.572 6.35a1.013 1.013 0 011.531 1.325l-8.212 9.488a1.013 1.013 0 01-1.532 0L5.497 12.7a1.012 1.012 0 111.531-1.325l3.097 3.578 7.447-8.603z" fill="currentColor"></path></svg>
                        </span>
                        {v}
                    </button>
                </li>
            ))}
            </ul>
        </motion.div>
    )
}

export default FontSizeCard
