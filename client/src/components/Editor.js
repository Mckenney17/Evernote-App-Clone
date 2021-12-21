import React, { useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react'
import AppContext from '../utils/AppContext'
import './Editor.scss'
import ToolBar from './ToolBar'
import EditingWindow from './EditingWindow'
import { dateToLocaleString } from '../utils/utilFuncs'
import NoteOptionsCard from './NoteOptionsCard'

function Editor() {
    const { notebooks, activeNotebook, activeNotelist, trash } = useContext(AppContext)
    const [expanded, setExpanded] = useState(false)
    const [noteOptionsCardActive, setNoteOptionsCardActive] = useState(false)
    const [noteLastEdited, setNoteLastEdited] = useState(null)
    const noteOptionsBtn = useRef(null)

    const [toolbarActive, setToolbarActive] = useState(true)
    const [editingActive, setEditingActive] = useState(true)
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

    useEffect(() => {
        const deactivateEditing = (ev) => {
            const editorArea = document.querySelector('.editor');
            if (!ev.path.includes(editorArea)) setEditingActive(false)
        }
        document.addEventListener('click', deactivateEditing)
        return () => {
            document.removeEventListener('click', deactivateEditing)
        }
    }, [])

    const selectTools = ['text-level', 'super-family', 'font-size', 'fore-color', 'back-color', 'insert-link']
    // [state, dispatch] of useReducer === [state, setState] of useState
    // the first argument to reducer is the function to use to conditionally change the state
    // (state, action) // state is the state obj, while, action is the new value you want to be read
    // the second argument is the initial state like you'll pass to useState
    const [{ selectionDropTool }, setSelectionDropTool] = useReducer((state, action) => {
        return selectTools.includes(action.tool) ? { selectionDropTool: action.tool } : { selectionDropTool: null }
    }, { selectionDropTool: null })
    
    const getNotes = useCallback(() => {
        return activeNotelist !== 'Trash' || !trash.length ? notebooks[activeNotebook] || [] : trash;
    }, [activeNotelist, notebooks, activeNotebook, trash])

    return (
        <div className={`editor ${expanded ? 'expanded' : 'collapsed'}`}>
            {getNotes().length ?
            <React.Fragment>
                <header>
                    <div className="top-bar">
                        <div className="left-side">
                            <button className="expand-icon" title={expanded ? 'Collapse' : 'Expand'} onClick={() => setExpanded((prev) => !prev)}>{!expanded ? <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fillRule="evenodd" d="M6.031 3a3 3 0 00-3 3v11a3 3 0 003 3h11a3 3 0 003-3V6a3 3 0 00-3-3h-11zm4.47 4.289H8.184l2.915 2.914a.625.625 0 01-.884.884L7.3 8.172v2.319a.625.625 0 11-1.25 0V6.674c0-.351.285-.635.635-.635h3.818a.625.625 0 010 1.25zM12.6 15.76h2.318l-2.915-2.915a.625.625 0 11.884-.884l2.915 2.915V12.56a.625.625 0 011.25 0v3.817c0 .35-.285.635-.635.635H12.6a.625.625 0 110-1.25z"></path></svg> : <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fill-rule="evenodd" d="M6 3a3 3 0 00-3 3v11a3 3 0 003 3h11a3 3 0 003-3V6a3 3 0 00-3-3H6zm2.864 6.78H6.546a.625.625 0 100 1.25h3.817c.35 0 .635-.285.635-.636V6.577a.625.625 0 00-1.25 0v2.319L6.833 5.98a.625.625 0 00-.884.883L8.864 9.78zm5.299 3.468h2.318a.625.625 0 100-1.25h-3.817a.635.635 0 00-.635.635v3.817a.625.625 0 101.25 0V14.13l2.915 2.915a.625.625 0 10.884-.884l-2.915-2.914z"></path></svg>}</button>
                            <div className="divider">&nbsp;</div>
                            <div className="notebook-icon-text"><svg width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 5.5a.5.5 0 00-.5-.5h-3a.5.5 0 000 1h3a.5.5 0 00.5-.5z" fill="currentColor"></path><path fillRule="evenodd" clipRule="evenodd" d="M10 1H2v12h8a2 2 0 002-2V3a2 2 0 00-2-2zM3 12V2h1v10H3zm2 0V2h5a1 1 0 011 1v8a1 1 0 01-1 1H5z" fill="currentColor"></path></svg>Notebook(Coming Soon)</div>
                        </div>
                        <div className="right-side">
                            <button onClick={() => setNoteOptionsCardActive(true)} ref={noteOptionsBtn} className="note-options"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M4.5 12a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zm7.501 1.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm6 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"></path></svg></button>
                            {noteOptionsCardActive ?
                            <NoteOptionsCard setNoteOptionsCardActive={setNoteOptionsCardActive} noteOptionsBtn={noteOptionsBtn.current} />
                            : null}
                        </div>
                    </div>
                    {editingActive ? <ToolBar toolbarActive={toolbarActive} selectionDropTool={selectionDropTool} setSelectionDropTool={setSelectionDropTool} toolsState={toolsState} setToolsState={setToolsState} selColor={selColor} setSelColor={setSelColor} history={history} />
                    : <span className='last-edited-info'>Last edited on {dateToLocaleString(noteLastEdited)}</span>}
                </header>
                <EditingWindow setEditingActive={setEditingActive} setNoteLastEdited={setNoteLastEdited} getNotes={getNotes} setToolbarActive={setToolbarActive} selectionDropTool={selectionDropTool} setSelectionDropTool={setSelectionDropTool} toolsState={toolsState} setToolsState={setToolsState} selColor={selColor} setSelColor={setSelColor} history={history} setHistory={setHistory} />
            </React.Fragment> : null}
        </div>
    )
}

export default Editor
