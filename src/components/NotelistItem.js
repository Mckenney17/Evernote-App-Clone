import React from 'react'
import './NotelistItem.scss'

function NotelistItem({ title, bodyText, updatedAt }) {
    return (
        <div className="notelist-item active">
            <h4>{title}</h4>
            <p>{bodyText}</p>
            <span>5 minutes ago</span>
        </div>
    )
}

export default NotelistItem
