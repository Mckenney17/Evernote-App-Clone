import React, { useContext, useState } from 'react'
import axios from 'axios'
import useAuthFormCommonLogic from '../hooks/useAuthFormCommonLogic'
import useFormInputChange from '../hooks/useFormInputChange'
import AuthContext from '../utils/AuthContext'
import AuthForm from './AuthForm'
import './Login.scss'
import Spinner from './Spinner'

function Login() {
    const { pageReady,
        setPageReady,
        csrfToken,
        setCsrfToken,
        errorMessage,
        setErrorMessage,
        setLoading } = useContext(AuthContext)
    const [{ email, password }, setInputData] = useState({ email: '', password: '' })

    useAuthFormCommonLogic(setCsrfToken, setPageReady)

    const handleInputChange = useFormInputChange(setInputData, errorMessage, setErrorMessage)

    const handleLoginSubmit = async (ev) => {
        ev.preventDefault()
        const loginData = {
            email,
            password,
            _csrf: csrfToken,
        }
        try {
            setLoading(true)
            const res = await axios.post('/login', loginData)
            const { user } = res.data
            window.location.pathname = `/user/${user._id.toString()}`
        } catch(e) {
            const errRes = e.response;
            const { errorMessage } = errRes.data
            setLoading(false)
            if (errorMessage === 'Verification Error') {
                window.location.pathname = '/verify_email'
                return
            }
            setErrorMessage(errorMessage)
        }
    }

    return (
        <div className='login-page'>
            {pageReady ?
            <AuthForm action="/login" onSubmitHandler={handleLoginSubmit} formTitle='Login' buttonName='Login'>
                <input value={email} onChange={(ev) => handleInputChange(ev, 'email')} type="email" name="email" required placeholder='Email' />
                <input value={password} onChange={(ev) => handleInputChange(ev, 'password')} type="password" name="pwd" required placeholder='Password' />
            </AuthForm>
            : <Spinner /> }
        </div>
    )
}

export default Login
