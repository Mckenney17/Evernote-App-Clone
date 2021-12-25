import React, { useState } from 'react'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import AuthCheck from './AuthCheck'
import Login from './Login'
import Signup from './Signup'
import RequestPwdReset from './RequestPwdReset'
import ConfirmPwdReset from './ConfirmPwdReset'
import VerificationRequest from './VerificationRequest'
import VerificationReport from './VerificationReport'
import SetNewPassword from './SetNewPassword'
import Home from './Home'
import Error404 from './Error404'
import AuthContext from '../utils/AuthContext'

function App() {
    const [pageReady, setPageReady] = useState(false)
    const [csrfToken, setCsrfToken] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)

    return (
        <AuthContext.Provider value = {{
            pageReady,
            setPageReady,
            csrfToken,
            setCsrfToken,
            errorMessage,
            setErrorMessage,
            loading,
            setLoading,
        }}>
            <Router>
                <Switch>
                    <Route path='/login' exact component={Login} />
                    <Route path='/signup' exact component={Signup} />
                    <Route path='/verify_email' exact component={VerificationRequest} />
                    <Route path='/request_pwd_reset' exact component={RequestPwdReset} />
                    <Route path='/confirm_pwd_reset' exact component={ConfirmPwdReset} />
                    <Route path='/' exact component={AuthCheck} />
                    <Route path='/verify_email/:verificationToken' exact component={VerificationReport} />
                    <Route path='/set_new_password/:passwordResetToken' exact component={SetNewPassword} />
                    <Route path='/user/:userId' exact component={Home} />
                    <Route path='/' component={Error404} />
                </Switch>
            </Router>
        </AuthContext.Provider>
    )
}

export default App
