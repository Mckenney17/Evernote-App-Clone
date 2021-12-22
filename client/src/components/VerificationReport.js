import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Spinner from './Spinner'

function VerificationSuccess({ match }) {
    const [pageReady, setPageReady] = useState(false)
    const [verificationMessage, setVerificationMessage]= useState('')
    useEffect(() => {
        let ctd;
        (async () => {
            try {
                await axios.get(`/verify_email/${match.params.verificationToken}`)
                setPageReady(true)
                setVerificationMessage('Verification Successful. You will now be redirected to Login.')
                ctd = setTimeout(() => {
                    window.location.pathname = '/login'
                }, 3000)
            } catch (e) {
                window.location.pathname = '/'
            }
        })()
        return () => {
            clearTimeout(ctd)
        }
    }, [match])
    return (
        <React.Fragment>
        {pageReady ? (
        <div className='verification-success'>
            <p style={{ fontSize: '50px' }}>{verificationMessage}</p>
        </div>
        )
        : <Spinner />}
        </React.Fragment>
    )
}

export default VerificationSuccess
