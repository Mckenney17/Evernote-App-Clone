import { getFontFamily, capitalize } from "../utils/utilFuncs"

const useFormatting = ({ execCommand, setSelectionDropTool, setToolsState, toolsState, setHistory }) => {
    // tool clicking highlighting
    const format = (formatString) => {
        setSelectionDropTool({ tool: null })
        if (['bold', 'italic', 'underline'].includes(formatString)) {
            execCommand(formatString)
            setToolsState((prevToolsState) => {
                return {...prevToolsState, [formatString]: !prevToolsState[formatString]}
            })
        }

        if (formatString === 'fore-color') {
            setToolsState((prevToolsState) => {
                return {...prevToolsState, foreColor: !prevToolsState.foreColor}
            })
        }
        if (formatString === 'back-color') {
            setToolsState((prevToolsState) => {
                return {...prevToolsState, backColor: !prevToolsState.backColor}
            })
        }

        if (formatString.includes('font-size')) {
            const fontSize = parseInt(formatString.match(/\d+/)[0])
            setToolsState((prevToolsState) => {
                return {...prevToolsState, fontSize}
            })
            if (fontSize === toolsState.fontSize) return
            // document.execCommand doesn't implement fontSize well
            // i did a tweak with a span with fake bgColor, that i later replaced with trasparent
            execCommand('backColor', false, `rgb(${fontSize}, 0, 0)`)
        }

        if (formatString.includes('font-family')) {
            const superFamily = formatString.split('=').at(-1)
            setToolsState((prevToolsState) => {
                return {...prevToolsState, superFamily}
            })
            if (superFamily === toolsState.superFamily) return
            execCommand('fontName', false, getFontFamily(superFamily))
        }

        if (['Large heading', 'Medium heading', 'Small heading', 'Normal text'].includes(formatString)) {
            setToolsState((prevToolsState) => {
                return {...prevToolsState, textLevel: formatString}
            })

            execCommand('formatBlock', false, 
                formatString === 'Large heading' ? 'h1' :
                formatString === 'Medium heading' ? 'h2' :
                formatString === 'Small heading' ? 'h3' : 'p'
            )
        }

        if(formatString === 'unordered-list') {
            setToolsState((prevToolsState) => {
                return {...prevToolsState, unorderedList: !prevToolsState.unorderedList}
            })
            execCommand('insertUnorderedList')
        }
        if(formatString === 'ordered-list') {
            setToolsState((prevToolsState) => {
                return {...prevToolsState, orderedList: !prevToolsState.orderedList}
            })
            execCommand('insertOrderedList')
        }
        
        // indent // outdent
        if (formatString.endsWith('ent')) {
            execCommand(formatString)
        }
        
        // left, center, right align
        if (formatString.endsWith('align')) {
            execCommand(`justify${capitalize(formatString.split('-')[0])}`)
        }
        
        if (formatString === 'strikethrough') {
            setToolsState((prevToolsState) => {
                return {...prevToolsState, strikethrough: !prevToolsState.strikethrough}
            })
            execCommand('strikeThrough')
        }
        
        // subscript, superscript
        if (formatString.endsWith('script')) {
            setToolsState((prevToolsState) => {
                return {...prevToolsState, [formatString]: !prevToolsState[formatString]}
            })
            execCommand(formatString)
        }

        //undo, redo
        if (formatString.endsWith('do')) {
            if (formatString === 'undo') {
                setHistory((prevHistory) => {
                    return prevHistory.undo ? { ...prevHistory, redo: prevHistory.redo + 1} : prevHistory
                })
            } else {
                setHistory((prevHistory) => {
                    return prevHistory.redo ? { ...prevHistory, redo: prevHistory.redo - 1} : prevHistory
                })
            }
            execCommand(formatString)
        }

        if (formatString.includes('insert-link')) {
            const action = formatString.match(/%(.+)%/)[1]
            if (action !== 'cancel') {
                execCommand('insertHTML', false, action)
            }
        }
    }
    return format
}

export default useFormatting