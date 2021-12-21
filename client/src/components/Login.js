import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import './Login.scss'

function Login() {
    const [pageReady, setPageReady] = useState(false)
    const [{ email, password }, setInputData] = useState({ email: '', password: '' })
    const [csrfToken, setCsrfToken] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        (async () => {
            const res = await axios.get('/login')
            const { csrfToken } = res.data
            setCsrfToken(csrfToken)
            setPageReady(true)
        })()
    }, [])

    const handleInputChange = (ev, field) => {
        setInputData((prevInputData) => ({...prevInputData, [field]: ev.target.value}))
    }

    const handleLoginSubmit = async (ev) => {
        ev.preventDefault()
        const loginData = {
            email,
            password,
            _csrf: csrfToken,
        }
        try {
            const res = await axios.post('/login', loginData)
            const { userId } = res.data
            console.log(res.data)
        } catch(e) {
            const errRes = e.response;
            const { errorMessage} = errRes.data
            setErrorMessage(errorMessage)
        }
    }

    return (
        <div className='login-page'>
            {pageReady ?
            <form action="/login" method="post" onSubmit={handleLoginSubmit}>
                {errorMessage ? <p>{errorMessage}</p> : ''}
                <input value={email} onChange={(ev) => handleInputChange(ev, 'email')} type="email" name="email" required placeholder='Email' />
                <input value={password} onChange={(ev) => handleInputChange(ev, 'password')} type="password" name="pwd" required placeholder='Password' />
                <button type="submit">Login</button>
            </form>
            : <p>Loading...</p> }
        </div>
    )
}

export default Login
