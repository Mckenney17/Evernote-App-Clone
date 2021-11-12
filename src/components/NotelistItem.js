import React, { useContext } from 'react'
import AppContext from '../utils/AppContext'
import './NotelistItem.scss'

function NotelistItem({ id, title, bodyText, updatedAt, viewActions }) {
    const { activeNote, setActiveNote } = useContext(AppContext)
    return (
        <div onClick={() => setActiveNote(id)} className={`notelist-item ${viewActions.view.toLowerCase().replaceAll(' ', '-')} ${activeNote === id ? 'active' : ''}`}>
            <h4>{title}</h4>
            <p>{bodyText}</p>
            <span>5 minutes ago</span>
        </div>
    )
}

export default NotelistItem
