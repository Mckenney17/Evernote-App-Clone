import React, { useState, useContext } from 'react'
import axios from 'axios'
import useAuthFormCommonLogic from '../hooks/useAuthFormCommonLogic'
import useFormInputChange from '../hooks/useFormInputChange'
import AuthContext from '../utils/AuthContext'
import AuthForm from './AuthForm'
import './Signup.scss'
import Spinner from './Spinner'

function Signup() {
    const { pageReady,
        csrfToken,
        errorMessage,
        setErrorMessage,
        setLoading } = useContext(AuthContext)
    const [{firstName, lastName, email, password, confirmPassword }, setInputData] = useState({firstName: '', lastName: '', email: '', password: '', confirmPassword: '' })

    useAuthFormCommonLogic()

    const handleInputChange = useFormInputChange(setInputData, errorMessage, setErrorMessage)

    const handleEmailValidation = async (ev) => {
        try {
            await axios.post('/email_validate', { email: ev.target.value, _csrf: csrfToken })
            ev.target.style.borderColor = ''
        } catch(e) {
            const {response} = e
            if (response.status === 401) {
                ev.target.style.borderColor = 'red'
            }
        }
    }

    const handleSignupSubmit = async (ev) => {
        ev.preventDefault()
        if (password !== confirmPassword) return setErrorMessage('Password mismatch')
        const signupData = {
            firstName,
            lastName,
            email,
            password,
            _csrf: csrfToken,
            origin: window.location.origin,
        }
        try {
            setLoading(true)
            await axios.post('/signup', signupData)
            window.location.pathname = '/verify_email'
        } catch(e) {
            const errRes = e.response;
            const { errorMessage} = errRes.data
            setErrorMessage(errorMessage)
            setLoading(false)
        }
    }

    return (
        <div className='signup-page'>
            {pageReady ?
            <AuthForm action="/signup" onSubmitHandler={handleSignupSubmit} formTitle='Sign Up' buttonName='Sign Up'>
                <input value={firstName} onChange={(ev) => handleInputChange(ev, 'firstName')} type="text" name="first_name" required placeholder='Firstname' />
                <input value={lastName} onChange={(ev) => handleInputChange(ev, 'lastName')} type="text" name="last_name" placeholder='Lastname' />
                <input value={email} onBlur={handleEmailValidation} onChange={(ev) => handleInputChange(ev, 'email')} type="email" name="email" required placeholder='Email' />
                <input value={password} onChange={(ev) => handleInputChange(ev, 'password')} type="password" name="pwd" required placeholder='Password' />
                <input value={confirmPassword} onChange={(ev) => handleInputChange(ev, 'confirmPassword')} type="password" name="cpwd" required placeholder='Confirm Password' />
            </AuthForm>
            : <Spinner /> }
        </div>
    )
}

export default Signup
