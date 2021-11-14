import React, { useContext } from 'react'
import AppContext from '../utils/AppContext'
import './NotelistItem.scss'
import { hyphenate } from '../utils/utilFuncs'

function NotelistItem({ id, title, bodyText, updatedAt, createdAt, viewActions }) {
    const { activeNote, setActiveNote } = useContext(AppContext)
    return (
        <div onClick={() => setActiveNote(id)} className={`notelist-item ${hyphenate(viewActions.view)} ${activeNote === id ? 'active' : ''}`}>
            {['Cards', 'Snippets'].includes(viewActions.view) ? (
                <React.Fragment>
                    <h4>{title}{id}</h4>
                    <div className="content">
                        <p>{bodyText}</p>
                    </div>
                    <span className="date-updated">5 minutes ago</span>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <div className="title-cell">{title}{id}</div>
                    {viewActions.dateUpdated && <div className="date-updated-cell">5 minutes ago</div>}
                    {viewActions.dateCreated && <div className="date-created-cell">November 7</div>}
                </React.Fragment>
            )}
        </div>
    )
}

export default NotelistItem
