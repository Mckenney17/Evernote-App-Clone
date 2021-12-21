import React, { useEffect } from 'react'
import axios from 'axios'

function SessionCheck() {
    useEffect(() => {
        (async () => {
            const session = await axios.get('/session_check')
            const { isAuthenticated, user } = session.data
            if (!isAuthenticated) {
                window.location.pathname = '/login'
            } else {
                window.location.pathname = `/user${user._id}`
            }
        })()
    }, [])
    return (
        <div>
            Loading...
        </div>
    )
}

export default SessionCheck
