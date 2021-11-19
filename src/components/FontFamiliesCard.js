import React from 'react'
import './FontFamiliesCard.scss'

function FontFamiliesCard() {
    return (
        <div className="font-families-card">
            <ul>
                <li><button style={{ fontFamily: 'Source Sans Pro' }}>Sans serif</button></li>
                <li><button style={{ fontFamily: 'Source Serif Pro' }}>Serif</button></li>
                <li><button style={{ fontFamily: 'Zilla Slab' }}>Slab serif</button></li>
                <li><button style={{ fontFamily: 'Source Code Pro' }}>Monospace</button></li>
                <li><button style={{ fontFamily: 'Dancing Script' }}>Script</button></li>
                <li><button style={{ fontFamily: 'Kalam' }}>Handwritten</button></li>
            </ul>
        </div>
    )
}

export default FontFamiliesCard
