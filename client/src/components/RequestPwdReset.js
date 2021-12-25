import axios from 'axios'
import React, { useState, useContext } from 'react'
import useAuthFormCommonLogic from '../hooks/useAuthFormCommonLogic'
import useFormInputChange from '../hooks/useFormInputChange'
import AuthContext from '../utils/AuthContext'
import './RequestPwdReset.scss'
import Spinner from './Spinner'

function RequestPwdReset() {
    const { pageReady,
        setPageReady,
        csrfToken,
        setCsrfToken,
        errorMessage,
        setErrorMessage,
        loading,
        setLoading } = useContext(AuthContext)
    const [{email}, setInputData] = useState({email: ''})

    useAuthFormCommonLogic(setCsrfToken, setPageReady)

    const handleInputChange = useFormInputChange(setInputData, errorMessage, setErrorMessage)

    const handleRequestPwdResetSubmit = async (ev) => {
        ev.preventDefault()
        const resetData = {
            email,
            _csrf: csrfToken,
            origin: window.location.origin,
        }
        try {
            setLoading(true)
            await axios.post('/request_pwd_reset', resetData)
            window.location.pathname = '/confirm_pwd_reset'
        } catch(e) {
            const errRes = e.response;
            const { errorMessage} = errRes.data
            setErrorMessage(errorMessage)
            setLoading(false)
        }
    }

    return (
        <div className='request-pwd-reset-page'>
            {pageReady ?
            <React.Fragment>
            <form action="/request_pwd_reset" method="post" onSubmit={handleRequestPwdResetSubmit}>
                    <div className='form-title'>Password Reset</div>
                    <div className='logo'></div>
                    <div className='error-message' style={ errorMessage ? { opacity: 1 } : { opacity: 0 }}>
                        <span className='info-icon'><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8.25706 3.09882C9.02167 1.73952 10.9788 1.73952 11.7434 3.09882L17.3237 13.0194C18.0736 14.3526 17.1102 15.9999 15.5805 15.9999H4.4199C2.89025 15.9999 1.92682 14.3526 2.67675 13.0194L8.25706 3.09882ZM11.0001 13C11.0001 13.5523 10.5524 14 10.0001 14C9.44784 14 9.00012 13.5523 9.00012 13C9.00012 12.4477 9.44784 12 10.0001 12C10.5524 12 11.0001 12.4477 11.0001 13ZM10.0001 5C9.44784 5 9.00012 5.44772 9.00012 6V9C9.00012 9.55228 9.44784 10 10.0001 10C10.5524 10 11.0001 9.55228 11.0001 9V6C11.0001 5.44772 10.5524 5 10.0001 5Z" fill="currentColor"/>
                        </svg></span>
                        {errorMessage}
                    </div>
                    <input value={email} onChange={(ev) => handleInputChange(ev, 'email')} type="email" name="email" required placeholder='Email' />
                    <button className={loading ? 'loading' : ''} type="submit">{loading ? <span></span> : 'Reset'}</button>
                </form>
            </React.Fragment>
            : <Spinner /> }
        </div>
    )
}

export default RequestPwdReset
