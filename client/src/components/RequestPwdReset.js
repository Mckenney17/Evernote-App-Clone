import React, { useState, useContext } from 'react'
import axios from 'axios'
import useAuthFormCommonLogic from '../hooks/useAuthFormCommonLogic'
import useFormInputChange from '../hooks/useFormInputChange'
import AuthContext from '../utils/AuthContext'
import AuthForm from './AuthForm'
import './RequestPwdReset.scss'
import Spinner from './Spinner'

function RequestPwdReset() {
    const { pageReady,
        csrfToken,
        errorMessage,
        setErrorMessage,
        setLoading } = useContext(AuthContext)
    const [{email}, setInputData] = useState({email: ''})

    useAuthFormCommonLogic()

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
            <AuthForm action="/request_pwd_reset" onSubmitHandler={handleRequestPwdResetSubmit} formTitle='Password Reset' buttonName='Reset'>
                <input value={email} onChange={(ev) => handleInputChange(ev, 'email')} type="email" name="email" required placeholder='Email' />
            </AuthForm>
            : <Spinner /> }
        </div>
    )
}

export default RequestPwdReset
