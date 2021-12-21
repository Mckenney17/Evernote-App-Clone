import React from 'react'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import SessionCheck from './SessionCheck'
import Signup from './Signup'

function App() {
    return (
        <Router>
            <Switch>
                <Route path='/login' exact component={Login} />
                <Route path='/signup' exact component={Signup} />
                <Route path='/' exact component={SessionCheck} />
                <Route path='/:userId' exact component={Home} />
            </Switch>
        </Router>
    )
}

export default App
