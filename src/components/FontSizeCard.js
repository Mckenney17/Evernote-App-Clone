import React from 'react'
import './FontSizeCard.scss'

function FontSizeCard() {
    return (
        <div className="font-size-card">
            <ul>
            {[8,9,10,12,14,16,18,20,24,30,36,48,64,72,96].map((v, i) => (
                <li key={`fz-${v}`}><button>{v}</button></li>
            ))}
            </ul>
        </div>
    )
}

export default FontSizeCard
