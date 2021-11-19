import React from 'react'
import './TextLevelCard.scss'

function TextLevelsCard() {
    return (
        <div className="text-level-card">
            <ul>
                <li><button><h1>Heading Text</h1></button></li>
                <li><button><h3>Sub-heading Text</h3></button></li>
                <li><button>Normal Text</button></li>
            </ul>
        </div>
    )
}

export default TextLevelsCard
