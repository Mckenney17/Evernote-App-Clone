import axios from "axios"
import { useEffect, useContext } from "react"
import AuthContext from "../utils/AuthContext"

const useAuthFormCommonLogic = () => {
    const { setCsrfToken, setPageReady, setErrorMessage } = useContext(AuthContext)
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

    useEffect(() => {
        setErrorMessage('')
    }, [setErrorMessage])

}

export default useAuthFormCommonLogic