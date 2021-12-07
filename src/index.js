import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'

import App from './components/App'
window.addEventListener('load', () => {
    ReactDOM.render(<App/>, document.getElementById('kennote-root'))
})
