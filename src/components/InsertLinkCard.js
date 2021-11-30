import React from 'react'
import './InsertLinkCard.scss'

function InsertLinkCard() {
    return (
        <div className="insert-link-card">
            <div className="link-text">Text <input type="text" placeholder="example" /></div>
            <div className="link-url">Link <input type="url" placeholder="https://example.com" /></div>
            <div className="actions">
                <button className="cancel">Cancel</button>
                <button className="apply">Apply</button>
            </div>
        </div>
    )
}

export default InsertLinkCard
