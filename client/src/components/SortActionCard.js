import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import './SortActionCard.scss'
import useNotelistActionsDrop from '../hooks/useNotelistActionsDrop'

function SortActionCard({ sortActions, setSortActions, viewActionBtn, setActiveAction }) {
    const cardRef = useRef(null)
    useNotelistActionsDrop({ cardRef, setActiveAction, otherActionBtn: viewActionBtn })

    const changeOrder = () => setSortActions((prev) => ({ ...prev, order: prev.order === 'asc' ? 'desc' : 'asc' }))

    return (
        <motion.div ref={cardRef} className="sort-action-card" animate={{ y: 10, opacity: 1, type: 'tween' }}>
            <h5>SORT BY</h5>
            <ul>
                {['Title', 'Date Updated', 'Date Created'].map((optionText) => (
                    <li key={optionText} className={sortActions.sortBy === optionText ? 'checked' : ''}>
                        <button onClick={() => sortActions.sortBy === optionText ? changeOrder() : setSortActions((prev) => ({...prev, sortBy: optionText}))}>
                            <span className="order-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M17 19a.75.75 0 01-.75-.75V7.56l-2.72 2.72a.75.75 0 11-1.06-1.06l4-4a.75.75 0 011.06 0l4 4a.75.75 0 11-1.06 1.06l-2.72-2.72v10.69A.75.75 0 0117 19z" fill={sortActions.order === 'desc' ? '#e6e6e6' : 'currentColor'}></path><path fillRule="evenodd" clipRule="evenodd" d="M7 5a.75.75 0 00-.75.75v10.69l-2.72-2.72a.75.75 0 00-1.06 1.06l4 4a.75.75 0 001.06 0l4-4a.75.75 0 10-1.06-1.06l-2.72 2.72V5.75A.75.75 0 007 5z" fill={sortActions.order === 'desc' ? 'currentColor' : '#e6e6e6'}></path></svg>
                            </span>
                            <span className="option-text">{optionText}</span>
                        </button>
                    </li>
                ))}
            </ul>
            <button className={`snig-option ${sortActions.snig ? 'checked' : ''}`}>
                <span className="check-mark-icon">
                    <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M17.572 6.35a1.013 1.013 0 011.531 1.325l-8.212 9.488a1.013 1.013 0 01-1.532 0L5.497 12.7a1.012 1.012 0 111.531-1.325l3.097 3.578 7.447-8.603z" fill="currentColor"></path></svg>
                </span>
                <span onClick={() => setSortActions((prev) => ({...prev, snig: !prev.snig}))} className="option-text">Show notes in groups</span>
            </button>
        </motion.div>
    )
}

export default SortActionCard
