import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Spinner from './Spinner'

function VerificationSuccess({ match }) {
    const [pageReady, setPageReady] = useState(false)
    const [verificationMessage, setVerificationMessage]= useState('')
    useEffect(() => {
        (async () => {
            try {
                await axios.get(`/verify_email/${match.params.verificationToken}`)
                setPageReady(true)
                setVerificationMessage('Verification Successful. You will now be redirected to Login.')
            } catch (e) {
                window.location.pathname = '/'
            }
        })()
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
