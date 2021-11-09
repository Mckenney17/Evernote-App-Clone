import React from 'react'
import Search from './Search'
import './Sidebar.scss'

function Sidebar() {
    return (
        <div className="sidebar">
            <div className="top-section-search-newnote">
                <Search />
                <div className="newnote">
                    <button className="add-newnote">
                        <span className="add-icon">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM11 9v2H9a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V9a1 1 0 10-2 0z"></path></svg>
                        </span>
                    </button>
                    <span>New Note</span>
                </div>
            </div>
            <div className="menu-section">

            </div>
        </div>
    )
}

export default Sidebar
