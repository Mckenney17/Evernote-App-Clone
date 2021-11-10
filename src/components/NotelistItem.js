import React from 'react'
import './NotelistItem.scss'

function NotelistItem({ title, bodyText, updatedAt }) {
    return (
        <div className="notelist-item">
            <h4>{title}</h4>
            <p>{bodyText}</p>
            <span>{}</span>
        </div>
    )
}

export default NotelistItem
