const calcTimeElapsedHumanized = (time) => {
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

const toPhrase = (text) => capitalize(text.toLowerCase().replaceAll('-', ' '))

const allDocument = {
    addEventListener(type, handler) {
        [document, document.querySelector('iframe').contentWindow].map((doc) => doc.addEventListener(type, handler))
    },
    
    removeEventListener(type, handler) {
        [document, document.querySelector('iframe').contentWindow].map((doc) => doc.removeEventListener(type, handler))
    }
}

const getFontFamily = (superFamily) => {
    return superFamily === 'Sans serif' ? "'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
    : superFamily === 'Serif' ? "'Source Serif Pro', serif"
    : superFamily === 'Slab serif' ? "'Zilla Slab', slab-serif"
    : superFamily === 'Monospace' ? "'Source Code Pro', monospace"
    : superFamily === 'Script' ? "'Dancing Script', script"
    : superFamily === 'Handwritten' ? "Kalam, handwritten"
    : null
}

const extractSuperFamily = (fontFamily) => {
    return toPhrase(fontFamily.split(' ').at(-1))
}

const rgbToHex = (rgbStr) => {
    if (!rgbStr.includes('rgb')) return rgbStr
    const rgbArr = rgbStr.match(/\d+/g)
    return rgbArr.map((v) => Number(v).toString(16)).reduce((acc, v) => acc + v, '#')
}

const mapStringToUnicode = (value) => {
    return [...value.toString()].map((v) => v.codePointAt()).join('')
}

// eslint-disable-next-line no-extend-native
Object.defineProperty(Array.prototype, 'notelistSort', {
    value(sortActions) {
        const { sortBy, order } = sortActions
        return this.sort((noteA, noteB) => {
            return [['Title', 'title'], ['Date Created', 'createdAt'], ['Date Updated', 'updatedAt']]
            .reduce((acc, [name, prop]) => {
                if (sortBy === name) {
                    return acc + (order === 'desc' ? mapStringToUnicode(noteA[prop]) - mapStringToUnicode(noteB[prop]) : mapStringToUnicode(noteB[prop]) - mapStringToUnicode(noteA[prop]))
                }
                return acc
            }, 0)
        })
    }
})

export { 
    calcTimeElapsedHumanized,
    camelCase,
    hyphenate,
    capitalize,
    allDocument,
    getFontFamily,
    rgbToHex,
    toPhrase,
    extractSuperFamily,
    mapStringToUnicode,
}
