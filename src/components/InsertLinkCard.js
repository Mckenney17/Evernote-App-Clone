import { motion } from 'framer-motion';
import React, { useRef, useState } from 'react'
import useSelectionDrop from '../hooks/useSelectionDrop';
import './InsertLinkCard.scss'

function InsertLinkCard({ iframeSel, iframeDocument, format, setSelectionDropTool }) {
    const cardRef = useRef(null)
    useSelectionDrop({ cardRef, exSelector: 'insert-link', setSelectionDropTool })
    const insertionPoint = iframeSel.anchorNode.parentNode.getBoundingClientRect()
    const [linkText, setLinkText] = useState(iframeSel.toString())
    const [linkUrl, setLinkUrl] = useState('')

    return (
        <motion.div className="insert-link-card" ref={cardRef} animate={{ y: 10, opacity: 1, type: 'tween' }} style={{ top: iframeDocument.body.innerText.trim() ? insertionPoint.y + insertionPoint.height : insertionPoint.y, left: 'calc(50% - 200px)' }}>
            <div className="link-text">Text <input type="text" placeholder="example" onChange={(ev) => setLinkText(ev.currentTarget.value)} value={linkText} /></div>
            <div className="link-url">Link <input type="url" placeholder="https://example.com" onChange={(ev) => setLinkUrl(ev.currentTarget.value)} value={linkUrl} required /></div>
            <div className="actions">
                <button onClick={() => format('insert-link%cancel%')} className="cancel">Cancel</button>
                <button onClick={() => format(`insert-link%<a href='${linkUrl}'>${linkText}</a>%`)} className="apply">Apply</button>
            </div>
        </motion.div>
    )
}

export default InsertLinkCard
