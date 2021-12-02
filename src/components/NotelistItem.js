import React, { useContext } from 'react'
import ReactHtmlParser from 'react-html-parser'
import AppContext from '../utils/AppContext'
import './NotelistItem.scss'
import { hyphenate } from '../utils/utilFuncs'

function NotelistItem({ id, title, bodyText, updatedAt, createdAt, viewActions }) {
    const { activeNoteId, setActiveNoteId } = useContext(AppContext)
    return (
        <div onClick={() => setActiveNoteId(id)} className={`notelist-item ${activeNoteId === id ? 'active' : ''}`} id={hyphenate(viewActions.view)}>
            {['Cards', 'Snippets'].includes(viewActions.view) ? (
                <React.Fragment>
                    <h4>{title}</h4>
                    <div className="content">
                    {ReactHtmlParser(`<p>${bodyText.match(/<p>(.+)<\/p>/)?.[1] || ''}</p>`)}
                    </div>
                    <span className="date-updated">5 minutes ago</span>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <div className="title-cell">{title}</div>
                    {viewActions.dateUpdated && <div className="date-updated-cell">5 minutes ago</div>}
                    {viewActions.dateCreated && <div className="date-created-cell">November 7</div>}
                </React.Fragment>
            )}
        </div>
    )
}

export default NotelistItem
