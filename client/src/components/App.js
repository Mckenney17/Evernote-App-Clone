import React from 'react'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import AuthCheck from './AuthCheck'
import Login from './Login'
import Signup from './Signup'
import RequestPwdReset from './RequestPwdReset'
import ConfirmPwdReset from './ConfirmPwdReset'
import VerificationRequest from './VerificationRequest'
import VerificationReport from './VerificationReport'
import Error404 from './Error404'
import Spinner from './Spinner'

const Home = React.lazy(() => import('./Home'))

function App() {
    return (
        <React.Suspense fallback={<Spinner />}>
            <Router>
                <Switch>
                    <Route path='/login' exact component={Login} />
                    <Route path='/signup' exact component={Signup} />
                    <Route path='/verify_email' exact component={VerificationRequest} />
                    <Route path='/request_pwd_reset' exact component={RequestPwdReset} />
                    <Route path='/confirm_pwd_reset' exact component={ConfirmPwdReset} />
                    <Route path='/' exact component={AuthCheck} />
                    <Route path='/verify_email/:verificationToken' exact component={VerificationReport} />
                    <Route path='/user/:userId' exact component={Home} />
                    <Route path='/' component={Error404} />
                </Switch>
            </Router>
        </React.Suspense>
    )
}

export default App
