import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Spinner from './Spinner'
import './VerificationRequest.scss'

function VerificationRequest() {
    const [pageReady, setPageReady] = useState(false)
    const [email, setEmail] = useState('')
    const [csrfToken, setCsrfToken] = useState('')

    useEffect(() => {
        (async () => {
            try {
                const session = await axios.get('/session')
                const authRes = await axios.get('/auth_token')
                const { email } = session.data
                const { csrfToken } = authRes.data
                if (email) setEmail(email)
                else {
                    window.location.pathname = '/'
                }
                setCsrfToken(csrfToken)
                setPageReady(true)
            } catch (e) {
                console.log(e)
            }
        })()
    }, [])

    const handleLinkResend = async () => {
        try {
            const res = await axios.post('/resend_verification', { email, origin: window.location.origin, _csrf: csrfToken })
            alert(res.data.successMessage)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <React.Fragment>
            {pageReady ? (
            <div className='verification-request'>
                <div className="logo"></div>
                <h1>Verification Required</h1>
                <p>Follow the link we sent to <span>{email}</span> to verify your email and proceed.</p>
                <span>Didn't receive link?<button onClick={handleLinkResend}>Resend</button></span>
            </div>
            ) : <Spinner />}
        </React.Fragment>
    )
}

export default VerificationRequest