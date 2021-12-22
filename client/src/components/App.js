import React from 'react'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import AuthCheck from './AuthCheck'
import Spinner from './Spinner'

const Login = React.lazy(() => import('./Login'))
const Signup = React.lazy(() => import('./Signup'))
const Home = React.lazy(() => import('./Home'))
const VerificationRequest = React.lazy(() => import('./VerificationRequest'))

function App() {
    return (
        <React.Suspense fallback={<Spinner />}>
            <Router>
                <Switch>
                    <Route path='/login' exact component={Login} />
                    <Route path='/signup' exact component={Signup} />
                    <Route path='/verify' exact component={VerificationRequest} />
                    <Route path='/' exact component={AuthCheck} />
                    <Route path='/:userId' exact component={Home} />
                </Switch>
            </Router>
        </React.Suspense>
    )
}

export default App
