import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Signup.scss'
import Spinner from './Spinner'

function Signup() {
    const [pageReady, setPageReady] = useState(false)
    const [{firstName, lastName, email, password, confirmPassword }, setInputData] = useState({firstName: '', lastName: '', email: '', password: '', confirmPassword: '' })
    const [csrfToken, setCsrfToken] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            const res = await axios.get('/auth_token')
            const { csrfToken } = res.data
            setCsrfToken(csrfToken)
            setPageReady(true)
        })()
    }, [])

    const handleInputChange = (ev, field) => {
        setInputData((prevInputData) => ({...prevInputData, [field]: ev.target.value}))
        if (errorMessage) {
            setErrorMessage('')
        }
    }

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
            <React.Fragment>
            <form action="/signup" method="post" onSubmit={handleSignupSubmit}>
                    <div className='logo'></div>
                    <div className='error-message' style={ errorMessage ? { opacity: 1 } : { opacity: 0 }}>
                    <span className='info-icon'><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M8.25706 3.09882C9.02167 1.73952 10.9788 1.73952 11.7434 3.09882L17.3237 13.0194C18.0736 14.3526 17.1102 15.9999 15.5805 15.9999H4.4199C2.89025 15.9999 1.92682 14.3526 2.67675 13.0194L8.25706 3.09882ZM11.0001 13C11.0001 13.5523 10.5524 14 10.0001 14C9.44784 14 9.00012 13.5523 9.00012 13C9.00012 12.4477 9.44784 12 10.0001 12C10.5524 12 11.0001 12.4477 11.0001 13ZM10.0001 5C9.44784 5 9.00012 5.44772 9.00012 6V9C9.00012 9.55228 9.44784 10 10.0001 10C10.5524 10 11.0001 9.55228 11.0001 9V6C11.0001 5.44772 10.5524 5 10.0001 5Z" fill="currentColor"/>
                    </svg></span>
                    {errorMessage}
                    </div>
                    <input value={firstName} onChange={(ev) => handleInputChange(ev, 'firstName')} type="text" name="first_name" required placeholder='Firstname' />
                    <input value={lastName} onChange={(ev) => handleInputChange(ev, 'lastName')} type="text" name="last_name" placeholder='Lastname' />
                    <input value={email} onBlur={handleEmailValidation} onChange={(ev) => handleInputChange(ev, 'email')} type="email" name="email" required placeholder='Email' />
                    <input value={password} onChange={(ev) => handleInputChange(ev, 'password')} type="password" name="pwd" required placeholder='Password' />
                    <input value={confirmPassword} onChange={(ev) => handleInputChange(ev, 'confirmPassword')} type="password" name="cpwd" required placeholder='Confirm Password' />
                    <button className={loading ? 'loading' : ''} type="submit">
                    {loading ? <span></span> : 'Sign Up'}
                    </button>
                    <Link to='/login'>Have an account? Login</Link>
                </form>
            </React.Fragment>
            : <Spinner /> }
        </div>
    )
}

export default Signup
