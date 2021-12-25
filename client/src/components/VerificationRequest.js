import React, { useState, useContext } from 'react'
import useEmailAuths from '../hooks/useEmailAuths'
import AuthContext from '../utils/AuthContext'
import Spinner from './Spinner'
import './VerificationRequest.scss'

function VerificationRequest() {
    const { pageReady,
        setPageReady,
        csrfToken,
        setCsrfToken,
        loading,
        setLoading } = useContext(AuthContext)
    const [emailToVerify, setEmailToVerify] = useState('')

    const handleLinkResend = useEmailAuths({
        setEmail: setEmailToVerify,
        email: emailToVerify,
        setCsrfToken,
        setPageReady,
        setLoading,
        csrfToken,
        emailAuthProp: 'email_to_verify',
        emailAuthUrl: '/resend_verification',
    })

    return (
        <React.Fragment>
            {pageReady ? (
            <div className='verification-request'>
                <div className="logo"></div>
                <h1>Email verification required</h1>
                <p>Follow the link we sent to <span>{emailToVerify}</span> to verify your email and proceed.</p>
                <span>Didn't receive link? (or related issues.)</span>
                <button className={loading ? 'loading' : ''} onClick={handleLinkResend}>{loading ? <span></span> : 'Resend'}</button>
            </div>
            ) : <Spinner />}
        </React.Fragment>
    )
}

export default VerificationRequest
