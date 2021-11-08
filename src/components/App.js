import React from 'react'
import './App.scss'
import Editor from './Editor'
import Notelist from './Notelist'
import Sidebar from './Sidebar'

// sidebar
// notelist
// editor

function App() {
    return (
        <div className="app-wrapper">
            <Sidebar />
            <Notelist />
            <Editor/>
        </div>
    )
}

export default App
