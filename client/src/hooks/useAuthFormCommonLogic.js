import axios from "axios"
import { useEffect } from "react"

const useAuthFormCommonLogic = (setCsrfToken, setPageReady) => {
    useEffect(() => {
        (async () => {
            const session = await axios.get('/session')
            if (session.data.user) {
                window.location.pathname = '/'
            }
        })()
    }, [])

    useEffect(() => {
        (async () => {
            const authRes = await axios.get('/auth_token')
            const { csrfToken } = authRes.data
            setCsrfToken(csrfToken)
            setPageReady(true)
        })()
    }, [setCsrfToken, setPageReady])

}

export default useAuthFormCommonLogic