const useFormInputChange = (setInputData, errorMessage, setErrorMessage) => {
    return (ev, field) => {
        setInputData((prevInputData) => ({...prevInputData, [field]: ev.target.value}))
        if (errorMessage) {
            setErrorMessage('')
        }
    }
}

export default useFormInputChange