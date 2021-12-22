import React, { useEffect } from 'react'
import axios from 'axios'
import Spinner from './Spinner'

function SessionCheck() {
    useEffect(() => {
        (async () => {
            const session = await axios.get('/session')
            const { isAuthenticated, user } = session.data
            if (!isAuthenticated) {
                window.location.pathname = '/login'
            } else {
                window.location.pathname = `/user${user._id}`
            }
        })()
    }, [])
    return (
        <Spinner />
    )
}

export default SessionCheck
