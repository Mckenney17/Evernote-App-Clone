import { useEffect } from "react"
import axios from 'axios'

const useEmailAuths = ({setEmail, email, setCsrfToken, setPageReady, setLoading, csrfToken, emailAuthProp, emailAuthUrl}) => {
    useEffect(() => {
        (async () => {
            try {
                const session = await axios.get('/session')
                const emailInCheck = session.data[emailAuthProp]
                if (emailInCheck) setEmail(emailInCheck)
                else {
                    window.location.pathname = '/'
                }
                const authRes = await axios.get('/auth_token')
                const { csrfToken } = authRes.data
                setCsrfToken(csrfToken)
                setPageReady(true)
            } catch (e) {
                console.log(e)
            }
        })()
    }, [emailAuthProp, setCsrfToken, setEmail, setPageReady])

    return () => {
        (async () => {
            try {
                setLoading(true)
                const res = await axios.post(emailAuthUrl, { email, origin: window.location.origin, _csrf: csrfToken })
                alert(res.data.successMessage)
                setLoading(false)
            } catch (e) {
                const { response } = e
                setLoading(false)
                alert(response.data.errorMessage)
            }
        })()
    }
}

export default useEmailAuths