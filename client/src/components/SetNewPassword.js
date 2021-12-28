import React, { useState, useContext } from 'react'
import axios from 'axios'
import useAuthFormCommonLogic from '../hooks/useAuthFormCommonLogic'
import useFormInputChange from '../hooks/useFormInputChange'
import AuthContext from '../utils/AuthContext'
import AuthForm from './AuthForm'
import './SetNewPassword.scss'
import Spinner from './Spinner'

function SetNewPassword({ match }) {
    const { pageReady,
        csrfToken,
        errorMessage,
        setErrorMessage,
        setLoading } = useContext(AuthContext)
    const [{ newPassword, confirmNewPassword }, setInputData] = useState({ newPassword: '', confirmNewPassword: '' })

    useAuthFormCommonLogic()

    const handleInputChange = useFormInputChange(setInputData, errorMessage, setErrorMessage)

    const handleNewPasswordSubmit = async (ev) => {
        ev.preventDefault()
        if (newPassword !== confirmNewPassword) return setErrorMessage('Password mismatch')
        const newPasswordData = {
            newPassword,
            _csrf: csrfToken,
        }
        try {
            setLoading(true)
            await axios.post(`/set_new_password/${match.params.passwordResetToken}`, newPasswordData)
            window.location.pathname = '/login'
        } catch(e) {
            alert(e.response.data.errorMessage)
            window.location.pathname = '/request_pwd_reset'
        }
    }

    return (
        <div className='set-new-password'>
            {pageReady ?
            <AuthForm action='/set_new_password' onSubmitHandler={handleNewPasswordSubmit} formTitle='Set new password' buttonName='Reset password'>
                <input value={newPassword} onChange={(ev) => handleInputChange(ev, 'newPassword')} type="password" name="pwd" required placeholder='New Password' />
                <input value={confirmNewPassword} onChange={(ev) => handleInputChange(ev, 'confirmNewPassword')} type="password" name="cpwd" required placeholder='Confirm New Password' />
            </AuthForm>
            : <Spinner /> }
        </div>
    )
}

export default SetNewPassword
