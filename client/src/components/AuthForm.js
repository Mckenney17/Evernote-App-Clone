import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../utils/AuthContext'

function AuthForm({ action, onSubmitHandler, formTitle, buttonName, children }) {
    const { errorMessage, loading } = useContext(AuthContext)
    return (
        <form action={action} method="post" onSubmit={onSubmitHandler}>
            <div className="form-title">{formTitle}</div>
            <div className='logo'></div>
            <div className='error-message' style={ errorMessage ? { opacity: 1 } : { opacity: 0 }}>
                <span className='info-icon'><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M8.25706 3.09882C9.02167 1.73952 10.9788 1.73952 11.7434 3.09882L17.3237 13.0194C18.0736 14.3526 17.1102 15.9999 15.5805 15.9999H4.4199C2.89025 15.9999 1.92682 14.3526 2.67675 13.0194L8.25706 3.09882ZM11.0001 13C11.0001 13.5523 10.5524 14 10.0001 14C9.44784 14 9.00012 13.5523 9.00012 13C9.00012 12.4477 9.44784 12 10.0001 12C10.5524 12 11.0001 12.4477 11.0001 13ZM10.0001 5C9.44784 5 9.00012 5.44772 9.00012 6V9C9.00012 9.55228 9.44784 10 10.0001 10C10.5524 10 11.0001 9.55228 11.0001 9V6C11.0001 5.44772 10.5524 5 10.0001 5Z" fill="currentColor"/>
                </svg></span>
                {errorMessage}
            </div>
            {children}
            <button className={loading ? 'loading' : ''} type="submit">{loading ? <span></span> : buttonName}</button>
            {action === '/signup' ? <Link to='/login'>Have an account? Login</Link> : action === '/login' ?
                <React.Fragment>
                    <Link className='signup' to='/signup'>Don't have an account? Sign Up</Link>
                    <Link className='pwdreset' to='/request_pwd_reset'>Forgot Password</Link>
                </React.Fragment>
            : null}
        </form>
    )
}

export default AuthForm
