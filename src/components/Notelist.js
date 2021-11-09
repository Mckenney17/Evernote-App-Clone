import React, { useEffect } from 'react'
import './Notelist.scss'

function Notelist() {
    useEffect(() => {
        const resize = (ev) => {
            document.querySelector('.notelist').style.width = `${ev.clientX - document.querySelector('.sidebar').getBoundingClientRect().width}px`
        }
        const resizer = document.querySelector('.notelist .resizer');
        resizer.addEventListener('mousedown', (ev) => {
            document.addEventListener('mousemove', resize, false)
        }, false)
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', resize, false)
        }, false)
    }, [])

    return (
        <div className="notelist">
            <span className="resizer"></span>
        </div>
    )
}

export default Notelist
