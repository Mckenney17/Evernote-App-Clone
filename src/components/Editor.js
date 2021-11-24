import React, { useEffect, useRef, useState } from 'react'
import { getFontFamily } from '../utils/utilFuncs'
// import AppContext from '../utils/AppContext'
import './Editor.scss'
import ToolBar from './ToolBar'

function Editor() {
    // const { activeNote } = useContext(AppContext)
    const [selColor, setSelColor] = useState({ fore: '#000', back: '#ffef9e' })
    const [toolsState, setToolsState] = useState({
        textLevel: 'Normal Text',
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
        [['overflow-wrap', 'break-word'], ['font-family', getFontFamily(toolsState.superFamily)]]
        .forEach(([prop, val]) => {
            iframeDocument.body.style.setProperty(prop, val)
        })
        iframeDocument.body.focus()
    }, [toolsState])

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
            let canc = iframeSel.anchorNode
            // console.log(canc.parentNode.nodeName);
            if (!canc.parentNode) return;
            while (!['BODY', 'DIV', 'HTML'].includes(canc.parentNode.nodeName)) {
                ancestors.push(canc.parentNode.nodeName)
                canc = canc.parentNode
            }
            setToolsState((prevToolsState) => {
                const cloneTS = {...prevToolsState}
                const tagsProp = [['B', 'bold'], ['I', 'italic'], ['U', 'underline']]
                tagsProp.forEach(([tag, prop]) => {
                    ancestors.includes(tag) ? cloneTS[prop] = true : cloneTS[prop] = false
                })
                return cloneTS
            })
        }
        iframeDocument.addEventListener('selectionchange', handleSelectionChange)
        return () => {
            iframeDocument.removeEventListener('selectionchange', handleSelectionChange)
        }
    }, [])

    // tool clicking highlighting
    const format = (formatString) => {
        const iframeDocument = iframe.current.contentDocument
        // const iframeWindow = iframe.current.contentWindow

        const execCommand = (fs) => {
            iframeDocument.execCommand(fs)
        }

        if (['bold', 'italic', 'underline'].includes(formatString)) {
            execCommand(formatString)
            setToolsState((prevToolsState) => {
                return {...prevToolsState, [formatString]: !prevToolsState[formatString]}
            })
        }
    }

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
