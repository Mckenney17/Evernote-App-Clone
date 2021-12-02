import React, { useContext } from 'react'
import ReactHtmlParser from 'react-html-parser'
import AppContext from '../utils/AppContext'
import './NotelistItem.scss'
import { calcTimeElapsedHumanized, hyphenate } from '../utils/utilFuncs'

function NotelistItem({ id, title, summaryText, updatedAt, createdAt, viewActions }) {
    const { activeNoteId, setActiveNoteId } = useContext(AppContext)
    return (
        <div onClick={() => setActiveNoteId(id)} className={`notelist-item ${activeNoteId === id ? 'active' : ''}`} id={hyphenate(viewActions.view)}>
            {['Cards', 'Snippets'].includes(viewActions.view) ? (
                <React.Fragment>
                    <h4>{title}</h4>
                    <div className="content">
                        <p>{ReactHtmlParser(summaryText)}</p>
                    
                    </div>
                    <span className="date-updated">{calcTimeElapsedHumanized(updatedAt)}</span>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <div className="title-cell">{title}</div>
                    {viewActions.dateUpdated && <div className="date-updated-cell">{calcTimeElapsedHumanized(updatedAt)}</div>}
                    {viewActions.dateCreated && <div className="date-created-cell">November 7</div>}
                </React.Fragment>
            )}
        </div>
    )
}

export default NotelistItem
