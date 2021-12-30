import React, { useContext, useState, useEffect, useRef, useCallback } from 'react'
import useFormatting from '../hooks/useFormatting'
import AppContext from '../utils/AppContext'
import { rgbToHex, extractSuperFamily } from '../utils/utilFuncs'
import InsertLinkCard from './InsertLinkCard'

function EditingWindow({
    getNotes,
    setToolbarActive,
    setToolsState,
    setSelColor,
    selColor,
    toolsState,
    setHistory,
    history,
    setSelectionDropTool,
    selectionDropTool,
    setNoteLastEdited,
    setEditingActive,
}) {
    const { activeNoteId, setNotes } = useContext(AppContext)
    const [noteTitle, setNoteTitle] = useState('')

    useEffect(() => {
        if (!getNotes().length) return
        const note = getNotes().find((obj) => obj._id === activeNoteId)
        setNoteLastEdited(note.updatedAt)
    }, [activeNoteId, getNotes, setNoteLastEdited])

    useEffect(() => {
        if (!getNotes().length) return
        const note = getNotes().find((obj) => obj._id === activeNoteId)
        setNoteTitle(note.title)
    }, [activeNoteId, getNotes])

    const updateNotes = useCallback((updatedNote) => {
        setNotes((previousNotes) => {
            const clonePN = [...previousNotes]
            const indexOfNote = clonePN.findIndex((obj) => obj._id === activeNoteId)
            clonePN[indexOfNote] = updatedNote
            return clonePN
        })
    }, [activeNoteId, setNotes])
    
    const handleTitleChange = (ev) => {
        setNoteTitle(ev.target.value)
        const note = getNotes().find((obj) => obj._id === activeNoteId)
        const updatedNote = { ...note, title: ev.target.value || 'Untitled', updatedAt: Date.now() }
        updateNotes(updatedNote)
    }
    
    const iframe = useRef(document.querySelector('iframe'))
    useEffect(() => {
        const iframeDocument = iframe.current.contentDocument
        const updateListItem = () => {
            const note = getNotes().find((obj) => obj._id === activeNoteId)
            const updatedNote = { ...note, bodyText: iframeDocument.body.innerHTML, summaryText: iframeDocument.body.querySelector('p')?.innerHTML || '', updatedAt: Date.now() }
            updateNotes(updatedNote)
        }

        iframeDocument.addEventListener('keyup', updateListItem)
        return () => {
            iframeDocument.removeEventListener('keyup', updateListItem)
        }
    }, [activeNoteId, getNotes, iframe, updateNotes])

    const execCommand = (fs, sdu = false, vArg = null) => {
        const iframeDocument = iframe.current.contentDocument
        // iframeDocument.execCommand('styleWithCSS', false, true)
        iframeDocument.execCommand(fs, sdu, vArg)
    }

    useEffect(() => {
        const iframeDocumentBody = iframe.current.contentDocument.body
        const activateToolbar = () => {
            setToolbarActive(true)
            setEditingActive(true)
        }
        iframeDocumentBody.addEventListener('focus', activateToolbar)
        return () => {
            iframeDocumentBody.removeEventListener('focus', activateToolbar)
        }
    }, [iframe, setEditingActive, setToolbarActive])

    useEffect(() => {
        const iframeDocument = iframe.current.contentDocument
        if (!getNotes().length) return
        const note = getNotes().find((obj) => obj._id === activeNoteId)
        iframeDocument.body.innerHTML = note.bodyText
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeNoteId])

    const titleBox = useRef(document.querySelector('.editor-body textarea'))
    useEffect(() => {
        const iframeDocument = iframe.current.contentDocument
        const note = getNotes().find((obj) => obj._id === activeNoteId)
        if (note.hasOwnProperty('trashedAt')) {
            iframeDocument.designMode = 'off'
            titleBox.current.setAttribute('disabled', '')
        } else {
            iframeDocument.designMode = 'on'
            titleBox.current.removeAttribute('disabled')
        }
        
        ;['SourceSansPro-Regular', 'SourceSansPro-Italic', 'SourceSansPro-BoldItalic', 'SourceSerifPro-Regular', 'SourceSerifPro-It', 'SourceSerifPro-BoldIt']
        .forEach((font) => {
            iframeDocument.head.insertAdjacentHTML('beforeend', `<link rel="preload" as="font" type="font/woff2" href="/fonts/${font}.woff2" crossorigin>`)
        })

        const link = document.createElement('link')
        link.href ='/editorIframe.css'
        link.rel = 'preload'
        link.as = 'style'
        link.addEventListener('load', (ev) => {
            ev.target.onload = null
            ev.target.rel = 'stylesheet'
        })
        iframeDocument.head.appendChild(link)
    }, [activeNoteId, getNotes, iframe, titleBox])
    
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
    }, [iframe, setToolsState])

    // selection change tool highlighting
    useEffect(() => {
        const iframeDocument = iframe.current.contentDocument
        const iframeSel = iframe.current.contentWindow.getSelection()
        const handleSelectionChange = () => {
            const ancestors = []
            let currentAncestor = iframeSel.anchorNode
            if (!currentAncestor.parentNode) return;
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

            execCommand('formatBlock', false, 
            toolsState.textLevel === 'Large heading' ? 'h1' :
            toolsState.textLevel === 'Medium heading' ? 'h2' :
            toolsState.textLevel === 'Small heading' ? 'h3' : 'p'
        )

        }
        iframeDocument.addEventListener('selectionchange', handleSelectionChange)
        return () => {
            iframeDocument.removeEventListener('selectionchange', handleSelectionChange)
        }
    }, [toolsState, selColor, iframe, setToolsState, setSelColor])

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
    }, [iframe, setHistory])

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
    }, [iframe, setToolsState, toolsState.textLevel])

    useEffect(() => {
        const iframeDocument = iframe.current.contentDocument
        const doThis = () => {
            setHistory((prevHistory) => ({ ...prevHistory, redo: 0 }))
        }

        iframeDocument.addEventListener('keypress', doThis)
        return () => {
            iframeDocument.removeEventListener('keypress', doThis)
        }
    }, [history, iframe, setHistory])

    const format = useFormatting({ execCommand, setSelectionDropTool, setToolsState, toolsState, setHistory })

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
    }, [toolsState.textLevel])

    return (
        <div className="editor-body">
            <div className="note-title">
                <textarea ref={titleBox} onFocus={() => {setEditingActive(true); setToolbarActive(false)}} onChange={handleTitleChange} className="title-field" placeholder="Title" value={noteTitle === 'Untitled' ? '' : noteTitle}></textarea>
            </div>
            <div className="note-editing-window">
                <iframe ref={iframe} title="Editing Window"></iframe>
                {selectionDropTool === 'insert-link' ? <InsertLinkCard setSelectionDropTool={setSelectionDropTool} execCommand={execCommand} format={format} iframeSel={iframe.current.contentWindow.getSelection()} iframeDocument={iframe.current.contentDocument} /> : null}
            </div>
        </div>
    )
}

export default EditingWindow
