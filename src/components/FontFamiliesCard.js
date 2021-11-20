import React from 'react'
import './FontFamiliesCard.scss'

function FontFamiliesCard() {
    return (
        <div className="font-families-card">
            <ul>
            {[['Sans serif', 'Source Sans Pro'], ['Serif', 'Source Serif Pro'], ['Slab serif', 'Zilla Slab'], ['Monospace', 'Source Code Pro'], ['Script', 'Dancing Script'], ['Handwritten', 'Kalam']].map(([superFamily, fontFamily]) => (
                <li key={superFamily}><button style={{ fontFamily }}>{superFamily}</button></li>
            ))}
            </ul>
        </div>
    )
}

export default FontFamiliesCard
