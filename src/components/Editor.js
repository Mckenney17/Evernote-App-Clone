import React, { useEffect, useRef, useState } from 'react'
import { getFontFamily, rgbToHex, extractSuperFamily } from '../utils/utilFuncs'
// import AppContext from '../utils/AppContext'
import './Editor.scss'
import ToolBar from './ToolBar'

function Editor() {
    // const { activeNote } = useContext(AppContext)
    const [selColor, setSelColor] = useState({ fore: '#000000', selFore: '#000000', back: '#ffef9e', selBack: '#ffef9e' })
    const [toolsState, setToolsState] = useState({
        textLevel: 'Normal text',
        superFamily: 'Sans serif',
        fontSize: 14,
        foreColor: false,
        bold: false,
        italic: false,
        underline: false,
        backColor: false,
        indent: false,
        outdent: false,
        strikethrough: false,
        superscript: false,
        subscript: false,
    })
    const iframe = useRef(document.querySelector('iframe'))
    useEffect(() => {
        const iframeDocument = iframe.current.contentDocument
        iframeDocument.designMode = 'on';
        [['overflow-wrap', 'break-word'], ['font-family', getFontFamily('Sans serif')], ['font-size', '14px']]
        .forEach(([prop, val]) => {
            iframeDocument.body.style.setProperty(prop, val)
        })
        iframeDocument.body.focus()        
    }, [])
    
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
                // const tagsProp = [['B', 'bold'], ['I', 'italic'], ['U', 'underline']]
                if (currentAncestor.parentNode.innerText.trim() === '') return cloneTS
                ancestors.forEach((ancestorNode, index, ancestorArr) => {
                    if (ancestorArr.some((ancNode) => ancNode.nodeName === 'B' || ancNode.style.fontWeight === 'bold')) cloneTS.bold = true
                    else cloneTS.bold = false
                    if (ancestorArr.some((ancNode) => ancNode.nodeName === 'I' || ancNode.style.fontStyle === 'italic')) cloneTS.italic = true
                    else cloneTS.italic = false
                    if (ancestorArr.some((ancNode) => ancNode.nodeName === 'U' || ancNode.style.textDecorationLine === 'underline')) cloneTS.underline = true
                    else cloneTS.underline = false
                    if (ancestorArr.some((ancNode) => ancNode.color || ancNode.style.color)) {
                        cloneTS.foreColor = true
                        const check1 = ancestorNode.color
                        const check2 = rgbToHex(ancestorNode.style.color)
                        if (check1 || check2) {
                            setSelColor((prevSelColor) => ({...prevSelColor, fore: check1 || check2}))
                        }
                    } else {
                        cloneTS.foreColor = false
                        setSelColor((prevSelColor) => ({...prevSelColor, fore: selColor.selFore}))
                    }
                    if (ancestorArr.some((ancNode) => ancNode.style.backgroundColor && ['#ffef9e', '#fec1d0', '#b7f7d1', '#adecf4', '#cbcaff', '#ffd1b0'].includes(rgbToHex(ancNode.style.backgroundColor)))) {
                        cloneTS.backColor = true
                        if (ancestorNode.style.backgroundColor) {
                            setSelColor((prevSelColor) => ({...prevSelColor, back: rgbToHex(ancestorNode.style.backgroundColor)}))
                        }
                    } else {
                        cloneTS.backColor = false
                        setSelColor((prevSelColor) => ({...prevSelColor, back: selColor.selBack}))
                    }

                    const closestFontSizeElem = iframeSel.anchorNode.parentNode.closest('*[style*="font-size"]')
                    if (closestFontSizeElem) {
                        cloneTS.fontSize = parseInt(closestFontSizeElem.style.fontSize)
                    } else {
                        cloneTS.fontSize = 14
                    }

                    if (ancestorArr.some((ancNode) => ancNode.face || ancNode.style.fontFamily)) {
                        if (ancestorNode.face || ancestorNode.style.fontFamily) {
                            cloneTS.superFamily = extractSuperFamily(ancestorNode.face || ancestorNode.style.fontFamily)
                        }
                    } else {
                        cloneTS.superFamily = 'Sans serif'
                    }
                })
                return cloneTS
            })
        }
        iframeDocument.addEventListener('selectionchange', handleSelectionChange)
        return () => {
            iframeDocument.removeEventListener('selectionchange', handleSelectionChange)
        }
    }, [toolsState, selColor])

    useEffect(() => {
        const iframeDocument = iframe.current.contentDocument
        const fontSizes = [8, 9, 10, 12, 14, 16, 18, 20, 24, 30, 36, 48, 64, 72, 96]
        const doThis = () => {
            fontSizes.forEach((fsv) => {
                iframeDocument.querySelectorAll(`span[style*="background-color: rgb(${fsv}, 0, 0);"]`).forEach((elem) => {
                    elem.style.backgroundColor = 'transparent'
                    elem.style.fontSize = `${fsv}px`
                })
            })
            iframeDocument.querySelectorAll(`span[style*="background-color: rgb(255, 255, 255);"]`).forEach((elem) => {
                elem.style.backgroundColor = 'transparent'
            })
        }
        iframeDocument.addEventListener('input', doThis)
        return () => {
            iframeDocument.removeEventListener('input', doThis)
        }
    }, [])

    // tool clicking highlighting
    const execCommand = (fs, sdu = false, vArg = null) => {
        const iframeDocument = iframe.current.contentDocument
        // iframeDocument.execCommand('styleWithCSS', false, true)
        iframeDocument.execCommand(fs, sdu, vArg)
    }
    const format = (formatString: string) => {
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
        const iframeDocument = iframe.current.contentDocument
        iframeDocument.querySelectorAll('*')
        .forEach((elem) => {
            elem.style.setProperty('margin', '0')
            elem.style.setProperty('padding', '0')
            elem.style.setProperty('box-sizing', 'border-box')
        })
    }, [toolsState])
    return (
        <div className="editor">
            <header>
                <div className="top-bar">
                    <div className="left-side">
                        <button className="expand-icon"><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fillRule="evenodd" d="M6.031 3a3 3 0 00-3 3v11a3 3 0 003 3h11a3 3 0 003-3V6a3 3 0 00-3-3h-11zm4.47 4.289H8.184l2.915 2.914a.625.625 0 01-.884.884L7.3 8.172v2.319a.625.625 0 11-1.25 0V6.674c0-.351.285-.635.635-.635h3.818a.625.625 0 010 1.25zM12.6 15.76h2.318l-2.915-2.915a.625.625 0 11.884-.884l2.915 2.915V12.56a.625.625 0 011.25 0v3.817c0 .35-.285.635-.635.635H12.6a.625.625 0 110-1.25z"></path></svg></button>
                        <div className="divider">&nbsp;</div>
                        <div className="notebook-icon-text"><svg width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 5.5a.5.5 0 00-.5-.5h-3a.5.5 0 000 1h3a.5.5 0 00.5-.5z" fill="currentColor"></path><path fillRule="evenodd" clipRule="evenodd" d="M10 1H2v12h8a2 2 0 002-2V3a2 2 0 00-2-2zM3 12V2h1v10H3zm2 0V2h5a1 1 0 011 1v8a1 1 0 01-1 1H5z" fill="currentColor"></path></svg>Notebook(Coming Soon)</div>
                    </div>
                    <div className="right-side">
                        <button className="note-options"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M4.5 12a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zm7.501 1.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm6 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"></path></svg></button>
                    </div>
                </div>
                <ToolBar toolsState={toolsState} setToolsState={setToolsState} selColor={selColor} setSelColor={setSelColor} format={format} />
            </header>
            <div className="editor-body">
                <div className="note-title">
                    <textarea className="title-field" placeholder="Title"></textarea>
                </div>
                <div className="note-editing-window">
                    <iframe ref={iframe} title="Editing Window"></iframe>
                </div>
            </div>
        </div>
    )
}

export default Editor
