import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'

import App from './components/App'
import Spinner from './components/Spinner'
ReactDOM.render(<Spinner />, document.getElementById('kennote-root'))
window.addEventListener('load', () => {
    ReactDOM.render(
        <React.StrictMode>
            <App/>
        </React.StrictMode>,
    document.getElementById('kennote-root'))
})
