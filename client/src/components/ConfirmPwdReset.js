import React, { useState, useContext } from 'react'
import Spinner from './Spinner'
import './ConfirmPwdReset.scss'
import useEmailAuths from '../hooks/useEmailAuths'
import AuthContext from '../utils/AuthContext'

function ConfirmPwdReset() {
    const { pageReady,
        setPageReady,
        csrfToken,
        setCsrfToken,
        loading,
        setLoading } = useContext(AuthContext)
    const [pwdResetEmail, setPwdResetEmail] = useState('')

    const handleCofirmationResend = useEmailAuths({
        setEmail: setPwdResetEmail,
        email: pwdResetEmail,
        setCsrfToken,
        setPageReady,
        setLoading,
        csrfToken,
        emailAuthProp: 'pwd_reset_email',
        emailAuthUrl: '/resend_pwd_reset_confirmation',
    })

    return (
        <React.Fragment>
            {pageReady ? (
            <div className='pwd_reset_confirmation'>
                <div className="logo"></div>
                <h1>Confirm Password Reset</h1>
                <p>Follow the link we sent to <span>{pwdResetEmail}</span> to confirm password reset and proceed.</p>
                <span>Didn't receive link? (or related issues.)</span>
                <button className={loading ? 'loading' : ''} onClick={handleCofirmationResend}>{loading ? <span></span> : 'Resend'}</button>
            </div>
            ) : <Spinner />}
        </React.Fragment>
    )
}

export default ConfirmPwdReset
