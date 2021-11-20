import React from 'react'
import './TextLevelCard.scss'

function TextLevelsCard() {
    return (
        <div className="text-level-card">
            <ul>
            {[<h1>Heading Text</h1>, <h3>Sub-heading Text</h3>, 'Normal Text'].map((v, i) => (
                <li key={`tl-${i}`}><button>{v}</button></li>
            ))}
            </ul>
        </div>
    )
}

export default TextLevelsCard
