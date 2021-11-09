import React from 'react'
import Search from './Search'
import './Sidebar.scss'

function Sidebar() {
    return (
        <div className="sidebar">
            <div className="top-section-search-newnote">
                <Search />
            </div>
            <div className="menu-section">

            </div>
        </div>
    )
}

export default Sidebar
