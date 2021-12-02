import React, { useContext, useEffect, useReducer, useRef, useState } from 'react'
import { getFontFamily, rgbToHex, extractSuperFamily, capitalize } from '../utils/utilFuncs'
import AppContext from '../utils/AppContext'
import './Editor.scss'
import InsertLinkCard from './InsertLinkCard'
import ToolBar from './ToolBar'

function Editor() {
    const { activeNoteId, notes, updateNotes } = useContext(AppContext)
    const [noteTitle, setNoteTitle] = useState('')
    
    
    const [expanded, setExpanded] = useState(false)
    const [history, setHistory] = useState({ undo: 0, redo: 0 })
    const [selColor, setSelColor] = useState({ fore: '#000000', selFore: '#000000', back: '#ffef9e', selBack: '#ffef9e' })
    const [toolsState, setToolsState] = useState({
        textLevel: 'Normal text',
        superFamily: 'Sans serif',
        fontSize: 16,
        foreColor: false,
        bold: false,
        italic: false,
        underline: false,
        backColor: false,
        strikethrough: false,
        superscript: false,
        subscript: false,
        orderedList: false,
        unorderedList: false,
        undo: false,
        redo: false,
    })

    const selectTools = ['text-level', 'super-family', 'font-size', 'fore-color', 'back-color', 'insert-link']
    // [state, dispatch] of useReducer === [state, setState] of useState
    // the first argument to reducer is the function to use to conditionally change the state
    // (state, action) // state is the state obj, while, action is the new value you want to be read
    // the second argument is the initial state like you'll pass to useState
    const [{ selectionDropTool }, setSelectionDropTool] = useReducer((state, action) => {
        return selectTools.includes(action.tool) ? { selectionDropTool: action.tool } : { selectionDropTool: null }
    }, { selectionDropTool: null })

    useEffect(() => {
        if (!notes.length) return
        const note = notes.find((obj) => obj.id === activeNoteId)
        setNoteTitle(note.title)
    }, [activeNoteId, notes])

    const handleTitleChange = (ev) => {
        setNoteTitle(ev.target.value)
        const note = notes.find((obj) => obj.id === activeNoteId)
        const updatedNote = { ...note, title: ev.target.value || 'Untitled', updatedAt: Date.now() }
        updateNotes(updatedNote)
    }
    const iframe = useRef(document.querySelector('iframe'))

    useEffect(() => {
        const iframeDocument = iframe.current.contentDocument
        const updateListItem = () => {
            const note = notes.find((obj) => obj.id === activeNoteId)
            const updatedNote = { ...note, bodyText: iframeDocument.body.querySelector('p').innerHTML }
        updateNotes(updatedNote)
        }

        iframeDocument.addEventListener('input', updateListItem)
        return () => {
            iframeDocument.removeEventListener('input', updateListItem)
        }
    }, [activeNoteId, notes, updateNotes])

    const execCommand = (fs, sdu = false, vArg = null) => {
        const iframeDocument = iframe.current.contentDocument
        // iframeDocument.execCommand('styleWithCSS', false, true)
        iframeDocument.execCommand(fs, sdu, vArg)
    }
    useEffect(() => {
        const iframeDocument = iframe.current.contentDocument
        if (notes.length) {
            iframeDocument.designMode = 'on';
        } else {
            iframeDocument.designMode = 'off';
        }
        // iframeDocument.body.focus()
        
        ;['SourceSansPro-Regular', 'SourceSansPro-Italic', 'SourceSansPro-BoldItalic', 'SourceSerifPro-Regular', 'SourceSerifPro-It', 'SourceSerifPro-BoldIt']
        .forEach((font) => {
            iframeDocument.head.insertAdjacentHTML('beforeend', `<link rel="preload" as="font" type="font/woff2" href="fonts/${font}.woff2" crossorigin>`)
        })

        const link = document.createElement('link')
        link.href ='editorIframe.css'
        link.rel = 'preload'
        link.as = 'style'
        link.addEventListener('load', (ev) => {
            ev.target.onload = null
            ev.target.rel = 'stylesheet'
        })
        iframeDocument.head.appendChild(link)
    }, [notes])
    
    // control tool highlighting
    useEffect(() => {
        const iframeDocumentBody = iframe.current.contentDocument.body
        const keyControls = (ev) => {
            if (!ev.ctrlKey) return
            setToolsState((prevToolsState) => {
                const cloneTS = {...prevToolsState}
                const keysProp = [['b', 'bold'], ['i', 'italic'], ['u', 'underline']]
                keysProp.forEach(([key, prop]) => {
                    if (ev.key === key) {
                        cloneTS[prop] = !cloneTS[prop]
                        return
                    }
                })
                return cloneTS
            })
        }
        iframeDocumentBody.addEventListener('keyup', keyControls)
        return () => {
            iframeDocumentBody.removeEventListener('keyup', keyControls)
        }
    }, [])

    // selection change tool highlighting
    useEffect(() => {
        const iframeDocument = iframe.current.contentDocument
        const iframeSel = iframe.current.contentWindow.getSelection()
        const handleSelectionChange = (ev) => {
            const ancestors = []
            let currentAncestor = iframeSel.anchorNode
            if (!currentAncestor.parentNode) return;
            // override the execCommand fontSize functionality
            /* const someFontTagWithSize = currentAncestor.parentElement.closest('font[size]')
            if (someFontTagWithSize) {
                someFontTagWithSize.style.fontSize = `${toolsState.fontSize}px`
            } */
            while (!['BODY', 'DIV', 'HTML'].includes(currentAncestor.parentNode.nodeName)) {
                ancestors.push(currentAncestor.parentNode)
                currentAncestor = currentAncestor.parentNode
            }

            setToolsState((prevToolsState) => {
                const cloneTS = {...prevToolsState}
                const closestULElem = iframeSel.anchorNode.parentNode.closest('ul')
                if (closestULElem) {
                    cloneTS.unorderedList = true
                } else {
                    cloneTS.unorderedList = false
                }
                const closestOLElem = iframeSel.anchorNode.parentNode.closest('ol')
                if (closestOLElem) {
                    cloneTS.orderedList = true
                } else {
                    cloneTS.orderedList = false
                }
                
                
                // if (currentAncestor.parentNode.innerText.trim() === '') return cloneTS
                if (iframeDocument.body.innerText.trim() === '') return cloneTS
                const closestFontSizeElem = iframeSel.anchorNode.parentNode.closest('*[style*="font-size"]')
                if (closestFontSizeElem) {
                    cloneTS.fontSize = parseInt(closestFontSizeElem.style.fontSize)
                } else {
                    cloneTS.fontSize = 16
                }
                
                if (iframeSel.anchorNode.parentNode.closest('h1')) {
                    cloneTS.textLevel = 'Large heading'
                } else if (iframeSel.anchorNode.parentNode.closest('h2')) {
                    cloneTS.textLevel = 'Medium heading'
                } else if (iframeSel.anchorNode.parentNode.closest('h3')) {
                    cloneTS.textLevel = 'Small heading'
                } else {
                    cloneTS.textLevel = 'Normal text'
                }
                
                const closestSupElem = iframeSel.anchorNode.parentNode.closest('sup')
                if (closestSupElem) {
                    cloneTS.superscript = true
                } else {
                    cloneTS.superscript = false
                }
                const closestSubElem = iframeSel.anchorNode.parentNode.closest('sub')
                if (closestSubElem) {
                    cloneTS.subscript = true
                } else {
                    cloneTS.subscript = false
                }

                if (ancestors.some((ancNode) => ancNode.nodeName === 'B' || ancNode.style.fontWeight === 'bold')) cloneTS.bold = true
                else cloneTS.bold = false
                if (ancestors.some((ancNode) => ancNode.nodeName === 'I' || ancNode.style.fontStyle === 'italic')) cloneTS.italic = true
                else cloneTS.italic = false
                if (ancestors.some((ancNode) => ancNode.nodeName === 'U' || ancNode.style.textDecorationLine === 'underline')) cloneTS.underline = true
                else cloneTS.underline = false
                if (ancestors.some((ancNode) => ancNode.nodeName === 'STRIKE' || ancNode.style.textDecorationLine === 'line-through')) cloneTS.strikethrough = true
                else cloneTS.strikethrough = false

                const closestBgColElem = ancestors.filter((ancNode) => ancNode.style.backgroundColor).at(-1)
                if (closestBgColElem) {
                    cloneTS.backColor = true
                    setSelColor((prevSelColor) => ({...prevSelColor, back: rgbToHex(closestBgColElem.style.backgroundColor)}))
                } else {
                    cloneTS.backColor = false
                    setSelColor((prevSelColor) => ({...prevSelColor, back: selColor.selBack}))
                }

                const closestForeColElem = ancestors.filter((ancNode) => ancNode.color || ancNode.style.color).at(-1)
                if (closestForeColElem) {
                    cloneTS.foreColor = true
                    const check1 = closestForeColElem.color
                    const check2 = rgbToHex(closestForeColElem.style.color)
                    setSelColor((prevSelColor) => ({...prevSelColor, fore: check1 || check2}))
                } else {
                    cloneTS.foreColor = false
                    setSelColor((prevSelColor) => ({...prevSelColor, fore: selColor.selFore}))
                }

                const closestFontFamilyElem = ancestors.filter((ancNode) => ancNode.face || ancNode.style.fontFamily).at(-1)
                if (closestFontFamilyElem) {
                    cloneTS.superFamily = extractSuperFamily(closestFontFamilyElem.face || closestFontFamilyElem.style.fontFamily)
                } else {
                    cloneTS.superFamily = 'Sans serif'
                }
                return cloneTS
            })

        }
        iframeDocument.addEventListener('selectionchange', handleSelectionChange)
        return () => {
            iframeDocument.removeEventListener('selectionchange', handleSelectionChange)
        }
    }, [toolsState, selColor])

    const deepChildrenCount = useRef(0)
    useEffect(() => {
        const iframeDocument = iframe.current.contentDocument
        const fontSizes = [8, 9, 10, 12, 14, 16, 18, 20, 24, 30, 36, 48, 64, 72, 96]
        const doThis = (ev) => {
            fontSizes.forEach((fsv) => {
                iframeDocument.querySelectorAll(`span[style*="background-color: rgb(${fsv}, 0, 0);"]`).forEach((elem) => {
                    elem.style.removeProperty('background-color')
                    elem.style.fontSize = `${fsv}px`
                })
            })
            iframeDocument.querySelectorAll(`span[style*="background-color: rgb(255, 255, 255);"]`).forEach((elem) => {
                elem.style.removeProperty('background-color')
            })

            // undo, redo logic
            // set the historyCount to the number of descendants who are not ancestors themselves
            // still has a bug
            if (ev.inputType === 'deleteContentBackward') return
            const recursiveChildrenFetch = (parent) => {
                deepChildrenCount.current = 0
                const rcf = (parent) => {
                    [...parent.childNodes].forEach((node) => {
                        if (node.hasChildNodes?.()) {
                            rcf(node)
                        } else {
                            deepChildrenCount.current += 1
                        }
                    })
                }
                rcf(parent)
            }
            recursiveChildrenFetch(iframeDocument.body)
            setHistory((prevHistory) => ({...prevHistory, undo: iframeDocument.body.innerText.trim() ? deepChildrenCount.current : 0}))
        }
        iframeDocument.addEventListener('input', doThis)
        return () => {
            iframeDocument.removeEventListener('input', doThis)
        }
    }, [])

    useEffect(() => {
        const iframeDocument = iframe.current.contentDocument
        const doThis = () => {
            if(iframeDocument.body.innerHTML.trim() === '') {
                setToolsState((prevToolsState) => {
                    return {...prevToolsState, textLevel: 'Normal text'}
                })
            }
        }

        iframeDocument.addEventListener('keyup', doThis)
        return () => {
            iframeDocument.removeEventListener('keyup', doThis)
        }
    }, [toolsState.textLevel])

    useEffect(() => {
        const iframeDocument = iframe.current.contentDocument
        const doThis = (ev) => {
            setHistory((prevHistory) => ({ ...prevHistory, redo: 0 }))
        }

        iframeDocument.addEventListener('keypress', doThis)
        return () => {
            iframeDocument.removeEventListener('keypress', doThis)
        }
    }, [history])

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

    useEffect(() => {
        if (toolsState.backColor) execCommand('backColor', false, selColor.back)
        else execCommand('backColor', false, '#ffffff')
    }, [toolsState.backColor, selColor.back])

    useEffect(() => {
        if (toolsState.foreColor) execCommand('foreColor', false, selColor.fore)
        else execCommand('foreColor', false, '#000000')
    }, [toolsState.foreColor, selColor.fore])

    useEffect(() => {
        execCommand('formatBlock', false, 
            toolsState.textLevel === 'Large heading' ? 'h1' :
            toolsState.textLevel === 'Medium heading' ? 'h2' :
            toolsState.textLevel === 'Small heading' ? 'h3' : 'p'
        )
    }, [toolsState])

    return (
        <div className={`editor ${expanded ? 'expanded' : 'collapsed'}`}>
            <header>
                <div className="top-bar">
                    <div className="left-side">
                        <button className="expand-icon" title={expanded ? 'Collapse' : 'Expand'} onClick={() => setExpanded((prev) => !prev)}>{!expanded ? <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fillRule="evenodd" d="M6.031 3a3 3 0 00-3 3v11a3 3 0 003 3h11a3 3 0 003-3V6a3 3 0 00-3-3h-11zm4.47 4.289H8.184l2.915 2.914a.625.625 0 01-.884.884L7.3 8.172v2.319a.625.625 0 11-1.25 0V6.674c0-.351.285-.635.635-.635h3.818a.625.625 0 010 1.25zM12.6 15.76h2.318l-2.915-2.915a.625.625 0 11.884-.884l2.915 2.915V12.56a.625.625 0 011.25 0v3.817c0 .35-.285.635-.635.635H12.6a.625.625 0 110-1.25z"></path></svg> : <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fill-rule="evenodd" d="M6 3a3 3 0 00-3 3v11a3 3 0 003 3h11a3 3 0 003-3V6a3 3 0 00-3-3H6zm2.864 6.78H6.546a.625.625 0 100 1.25h3.817c.35 0 .635-.285.635-.636V6.577a.625.625 0 00-1.25 0v2.319L6.833 5.98a.625.625 0 00-.884.883L8.864 9.78zm5.299 3.468h2.318a.625.625 0 100-1.25h-3.817a.635.635 0 00-.635.635v3.817a.625.625 0 101.25 0V14.13l2.915 2.915a.625.625 0 10.884-.884l-2.915-2.914z"></path></svg>}</button>
                        <div className="divider">&nbsp;</div>
                        <div className="notebook-icon-text"><svg width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 5.5a.5.5 0 00-.5-.5h-3a.5.5 0 000 1h3a.5.5 0 00.5-.5z" fill="currentColor"></path><path fillRule="evenodd" clipRule="evenodd" d="M10 1H2v12h8a2 2 0 002-2V3a2 2 0 00-2-2zM3 12V2h1v10H3zm2 0V2h5a1 1 0 011 1v8a1 1 0 01-1 1H5z" fill="currentColor"></path></svg>Notebook(Coming Soon)</div>
                    </div>
                    <div className="right-side">
                        <button className="note-options"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M4.5 12a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zm7.501 1.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm6 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"></path></svg></button>
                    </div>
                </div>
                <ToolBar selectionDropTool={selectionDropTool} setSelectionDropTool={setSelectionDropTool} toolsState={toolsState} setToolsState={setToolsState} selColor={selColor} setSelColor={setSelColor} format={format} history={history} />
            </header>
            <div className="editor-body">
                <div className="note-title">
                    <textarea disabled={notes.length ? false : true} onChange={handleTitleChange} autoFocus className="title-field" placeholder="Title" value={noteTitle === 'Untitled' ? '' : noteTitle}></textarea>
                </div>
                <div className="note-editing-window">
                    <iframe ref={iframe} title="Editing Window"></iframe>
                    {selectionDropTool === 'insert-link' ? <InsertLinkCard setSelectionDropTool={setSelectionDropTool} execCommand={execCommand} format={format} iframeSel={iframe.current.contentWindow.getSelection()} iframeDocument={iframe.current.contentDocument} /> : null}
                </div>
            </div>
        </div>
    )
}

export default Editor
