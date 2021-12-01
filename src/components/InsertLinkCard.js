import { motion } from 'framer-motion';
import React, { useRef } from 'react'
import useSelectionDrop from '../hooks/useSelectionDrop';
import './InsertLinkCard.scss'

function InsertLinkCard({ iframeSel, iframeDocument, execCommand, format, setSelectionDropTool } : { iframeSel: Selection, iframeDocument: Document }) {
    const cardRef = useRef(null)
    useSelectionDrop({ cardRef, exSelector: 'insert-link', setSelectionDropTool })
    const insertionPoint = iframeSel.anchorNode.parentNode.getBoundingClientRect()

    return (
        <motion.div className="insert-link-card" ref={cardRef} animate={{ y: 10, opacity: 1, type: 'tween' }} style={{ top: iframeDocument.body.innerText.trim() ? insertionPoint.y + insertionPoint.height : insertionPoint.y, left: 'calc(50% - 200px)' }}>
            <div className="link-text">Text <input type="text" placeholder="example" /></div>
            <div className="link-url">Link <input type="url" placeholder="https://example.com" /></div>
            <div className="actions">
                <button className="cancel">Cancel</button>
                <button className="apply">Apply</button>
            </div>
        </motion.div>
    )
}

export default InsertLinkCard
