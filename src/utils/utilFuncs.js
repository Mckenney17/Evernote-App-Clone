const calcTimeElapsedHumanized = (time) => { // time: Number
    const elapsed = (Date.now() - time) / 1000

    if (elapsed < 60) return 'a few seconds ago'
    if (elapsed < 300) return 'a few minutes ago'
    if (elapsed < 3600) return `${Math.trunc(elapsed / 60)} munites ago`
    if (elapsed < 86400) {
        const calcHr = Math.trunc(elapsed / 3600)
        return `${calcHr} hour${calcHr > 1 ? 's' : ''} ago`
    }
    if (elapsed < 604800) {
        const calcDays = Math.trunc(elapsed / 86400)
        return `${calcDays} day${calcDays > 1 ? 's' : ''} ago`
    }
    if (elapsed < 2419200) {
        const calcWeeks = Math.trunc(elapsed / 604800)
        return `${calcWeeks} week${calcWeeks > 1 ? 's' : ''} ago`
    }
    if (elapsed < 31449600) {
        const calcMonths = Math.trunc(elapsed / 2419200)
        return `${calcMonths} month${calcMonths > 1 ? 's' : ''} ago`
    }
    const calcYears = Math.trunc(elapsed / 31449600)
    return `${calcYears} year${calcYears > 1 ? 's' : ''} ago`    
}

const capitalize = (text) => `${text[0].toUpperCase()}${text.slice(1)}`

const camelCase = (phrase) => phrase.split(/[\s-]/i).map((str, i) => i === 0 ? str.toLowerCase() : str.replace(str[0], str[0].toUpperCase())).join('')

const hyphenate = (phrase) => phrase.toLowerCase().replaceAll(' ', '-')

const allDocument = {
    addEventListener(type, handler) {
        [document, document.querySelector('iframe').contentWindow].map((doc) => doc.addEventListener(type, handler))
    },
    
    removeEventListener(type, handler) {
        [document, document.querySelector('iframe').contentWindow].map((doc) => doc.removeEventListener(type, handler))
    }
}

export { 
    calcTimeElapsedHumanized,
    camelCase,
    hyphenate,
    capitalize,
    allDocument,
}