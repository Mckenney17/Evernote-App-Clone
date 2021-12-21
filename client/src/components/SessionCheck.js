import React, { useEffect } from 'react'
import axios from 'axios'

function SessionCheck() {
    useEffect(() => {
        (async () => {
            const result = await axios.get('/session_check')
            console.log(result.data)
        })()
    }, [])
    return (
        <div>
            Loading...
        </div>
    )
}

export default SessionCheck
