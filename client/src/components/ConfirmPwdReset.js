import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Spinner from './Spinner'
import './ConfirmPwdReset.scss'

function ConfirmPwdReset() {
    const [pageReady, setPageReady] = useState(false)
    const [pwdResetEmail, setPwdResetEmail] = useState('')
    const [csrfToken, setCsrfToken] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            try {
                const session = await axios.get('/session')
                const authRes = await axios.get('/auth_token')
                const { pwd_reset_email } = session.data
                const { csrfToken } = authRes.data
                if (pwd_reset_email) setPwdResetEmail(pwd_reset_email)
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

    const handleCofirmationResend = async () => {
        try {
            setLoading(true)
            const res = await axios.post('/resend_pwd_reset_confirmation', { email: pwdResetEmail, origin: window.location.origin, _csrf: csrfToken })
            alert(res.data.successMessage)
            setLoading(false)
        } catch (e) {
            const { response } = e
            setLoading(false)
            alert(response.data.errorMessage)
        }
    }

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
