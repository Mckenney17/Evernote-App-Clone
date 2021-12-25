import axios from 'axios'
import React, { useEffect, useState, useContext } from 'react'
import AuthContext from '../utils/AuthContext'
import Spinner from './Spinner'

function VerificationReport({ match }) {
    const { pageReady, setPageReady} = useContext(AuthContext)
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
    }, [match, setPageReady])
    return (
        <React.Fragment>
        {pageReady ? (
        <div className='verification-success'>
            <p style={{ fontSize: '30px' }}>{verificationMessage}</p>
        </div>
        )
        : <Spinner />}
        </React.Fragment>
    )
}

export default VerificationReport
