import { motion } from 'framer-motion'
import axios from 'axios'
import React, { useContext, useEffect, useState, useRef, useCallback } from 'react'
import AppContext from '../utils/AppContext'
import { camelCase, dateToLocaleString, sortByToProp } from '../utils/utilFuncs'
import './Notelist.scss'
import NotelistItem from './NotelistItem'
import NotelistViewActionCard from './NotelistViewActionCard'
import SortActionCard from './SortActionCard'

function Notelist() {
    const { activeNotelist, notes, setNotes, trash, setIsToplistView, createNewNote, setActiveNoteId, setTrash, notelistReady, setNotelistReady } = useContext(AppContext)
    const [sortActions, setSortActions] = useState(JSON.parse(localStorage.getItem('kennote-sortActions')) || { sortBy: 'Date Updated', order: 'asc', snig: false })
    const [viewActions, setViewActions] = useState(JSON.parse(localStorage.getItem('kennote-viewActions')) || { view: 'Snippets', showImages: true, showBodyText: true, dateUpdated: false, dateCreated: true })
    const [activeAction, setActiveAction] = useState(null)
    const sortActionBtnRef = useRef(null)
    const viewActionBtnRef = useRef(null)
    

    const {sortBy, order, snig} = sortActions;
    const {view} = viewActions;

    useEffect(() => {
        localStorage.setItem('kennote-viewActions', JSON.stringify(viewActions))
        localStorage.setItem('kennote-sortActions', JSON.stringify(sortActions))
    }, [viewActions, sortActions])

    const isView = useCallback((v) => {
        return v === view || false
    }, [view])

    useEffect(() => {
        if (isView('Top list')) {
            setIsToplistView(true)
        } else {
            setIsToplistView(false)
        }
    }, [view, setIsToplistView, isView])

    const handleResizerDrag = (ev, info) => {
        if (!isView('Top list')) {
            document.querySelector('.notelist').style.width = `${info.point.x - document.querySelector('.sidebar').getBoundingClientRect().width}px`
        } else {
            document.querySelector('.notelist').style.height = `${info.point.y}px` 
        }
    }

    const handleDragEnd = () => {
        setTimeout(() => {
            document.querySelector('.notelist-resizer').style.transform = 'none'
        }, 50)
    }

    const notelistBody = useRef(document.querySelector('.notelist-body'))
    const notelistHeader = useRef(document.querySelector('.notelist header'))
    useEffect(() => {
        if (!notelistReady) return
        notelistBody.current.style.height = `${window.innerHeight - notelistHeader.current.getBoundingClientRect().height}px`
        const adjustHeight = () => {
            if (isView('Top list')) return
            notelistBody.current.style.height = `${window.innerHeight - notelistHeader.current.getBoundingClientRect().height}px`
        }

        window.addEventListener('resize', adjustHeight)
        return () => {
            window.removeEventListener('resize', adjustHeight)
        }
    }, [view, notelistBody, notelistHeader, isView, notelistReady])

    const emptyTrash = () => {
        localStorage.setItem('kennote-trash', JSON.stringify([]))
        setTrash([])
        setActiveNoteId(notes.find((obj) => obj.updatedAt === Math.max(...notes.map((obj) => obj.updatedAt)))?._id)
    }

    const sortNotelist = (filteredNotes) => {
        const prop = sortByToProp(sortBy)
        // insertionSort
        const unsorted = [...filteredNotes]
        for (let i = 1; i < unsorted.length; i++) {
            const focusItem = unsorted[i]
            if (order === 'asc') {
                if (focusItem[prop] < unsorted[i - 1][prop]) {
                    unsorted[i] = unsorted[i - 1]
                    unsorted[i - 1] = focusItem
                }
            } else {
                if (focusItem[prop] > unsorted[i - 1][prop]) {
                    unsorted[i] = unsorted[i - 1]
                    unsorted[i - 1] = focusItem
                }
            }
        }
        const sorted = unsorted
        return sorted
    }

    useEffect(() => {
        if (activeNotelist === 'Trash') return
        (async () => {
            // loading
            setNotelistReady(false)
            const category = activeNotelist === 'Notes' ? 'allNotes' : camelCase(activeNotelist)
            const res = await axios.get(`/get_notes/${category}`)
            const { noteItems } = res.data
            setNotes(noteItems)
            setActiveNoteId(noteItems.find((obj) => obj.updatedAt === Math.max(...noteItems.map((obj) => obj.updatedAt)))?._id)
            setNotelistReady(true)
            // loading ends
        })()
    }, [activeNotelist, setActiveNoteId, setNotelistReady, setNotes])

    useEffect(() => {
        if (activeNotelist !== 'Trash') return
        (async () => {
            setNotelistReady(false)
            const trashItems = await axios.get(`/get_trash`)
            setTrash(trashItems)
            setNotelistReady(true)
        })()
    }, [activeNotelist, setNotelistReady, setTrash])

    const getNotes = () => {
        if (activeNotelist === 'Trash') {
            return sortNotelist(trash)
        }
        return sortNotelist(notes)
    }


    return (
        <div className={`notelist ${isView('Top list') ? 'top-list-view-active' : ''}`}>
            <motion.span className="notelist-resizer" drag={isView('Top list') ? 'y' : 'x'} onDrag={handleResizerDrag} dragMomentum={false} onDragEnd={handleDragEnd}></motion.span>
            <header ref={notelistHeader}>
                <div className="title">
                    <span className="title-icon">
                        {activeNotelist === 'Notes'
                        ? <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M7.665 4.5h8.75c.92 0 1.667.746 1.667 1.667v8.748h-3.334a.625.625 0 00-.625.624v3.958H7.665c-.92 0-1.667-.747-1.667-1.667V6.167c0-.92.747-1.667 1.667-1.667zm7.037 4.584a.625.625 0 100-1.25H9.298a.625.625 0 100 1.25h5.404zm.625 2.918c0 .345-.28.625-.625.625H9.298a.625.625 0 010-1.25h5.404c.345 0 .625.28.625.625zm-4.363 4.158a.625.625 0 100-1.25H9.298a.625.625 0 100 1.25h1.666z" fill="currentColor"></path><path d="M15.373 16.164h2.157l-2.107 2.693-.05.06v-2.753z" fill="currentColor"></path></svg>
                        : <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.298 17.93l.494-8.846H7.208l.514 8.85c.05.88.78 1.57 1.664 1.57h5.248c.885 0 1.615-.692 1.664-1.575z" fill="currentColor"></path><path fillRule="evenodd" clipRule="evenodd" d="M11.167 4.087a2.292 2.292 0 00-2.292 2.291v.205H5.75a.625.625 0 100 1.25h12.5a.625.625 0 100-1.25h-3.125v-.205a2.292 2.292 0 00-2.292-2.291h-1.666zm2.708 2.496v-.205c0-.575-.466-1.041-1.042-1.041h-1.666c-.576 0-1.042.466-1.042 1.041v.205h3.75z" fill="currentColor"></path></svg>}
                    </span>
                    <span>{activeNotelist}</span>
                    <button style={{ opacity: activeNotelist === 'Trash' && trash.length ? 1 : 0 }} className='empty-trash' onClick={emptyTrash}>Empty Trash</button>
                </div>
                <div className="subheader">
                    <span className="notelist-count">{notelistReady ? `${getNotes().length} note${getNotes().length === 1 ? '' : 's'}` : '0 notes'}</span>
                    <div className="notelist-actions" role="toolbar">
                        <button ref={sortActionBtnRef} onClick={() => setActiveAction('sort')} className={`sort-notelist ${activeAction === 'sort' ? 'active' : ''}`}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.183 4.625a.625.625 0 00-1.25 0V17.87L5.067 16a.625.625 0 00-.884 0 .62.62 0 000 .88l2.933 2.94c.244.244.64.244.884 0l2.933-2.94a.62.62 0 000-.88.625.625 0 00-.884 0l-1.866 1.87V4.625zM11.625 5a.625.625 0 100 1.25h8.75a.625.625 0 100-1.25h-8.75zM11 9.375c0-.345.28-.625.625-.625h6.25a.625.625 0 110 1.25h-6.25A.625.625 0 0111 9.375zM11.625 12.5a.625.625 0 100 1.25h3.75a.625.625 0 100-1.25h-3.75z" fill="currentColor"></path></svg>
                        </button>
                        <button ref={viewActionBtnRef} onClick={() => setActiveAction('view')} className={`change-notelist-view ${activeAction === 'view' ? 'active' : ''}`}>
                            {isView('Snippets')
                            ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12.375 8.925V5.25H6a.75.75 0 00-.75.75v2.925h7.125zm0 1.25H5.25v3.65h7.125v-3.65zm0 4.9H5.25V18c0 .414.336.75.75.75h6.375v-3.675zM6 20a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6zm7.625-14.75H18a.75.75 0 01.75.75v12a.75.75 0 01-.75.75h-4.375V5.25z" fill="currentColor"></path></svg> : isView('Cards')
                            ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12.375 8.92V5.25H9.437v3.67h2.938zm0 1.25H9.437v3.655h2.938V10.17zm0 4.905H9.437v3.675h2.938v-3.675zM6 20a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6zm7.625-14.75H18a.75.75 0 01.75.75v12a.75.75 0 01-.75.75h-4.375V5.25zM5.25 8.92V6A.75.75 0 016 5.25h2.188v3.67H5.25zm0 1.25v3.655h2.938V10.17H5.25zm2.938 4.905H5.25V18c0 .414.336.75.75.75h2.188v-3.675z" fill="currentColor"></path></svg> : isView('Side list')
                            ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12.375 6.95v-1.7H6a.75.75 0 00-.75.75v.95h7.125zm0 1.25H5.25v1.705h7.125V8.2zm0 2.955H5.25v1.7h7.125v-1.7zm0 2.95H5.25v1.7h7.125v-1.7zm0 2.95H5.25V18c0 .414.336.75.75.75h6.375v-1.695zM6 20a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6zm7.625-14.75H18a.75.75 0 01.75.75v12a.75.75 0 01-.75.75h-4.375V5.25z" fill="currentColor"></path></svg> : isView('Top list')
                            ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4 18a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12zM5.25 6A.75.75 0 016 5.25h12a.75.75 0 01.75.75v.95H5.25V6zm0 2.2v1.705h13.5V8.2H5.25zm0 2.955h13.5V18a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75v-6.845z" fill="currentColor"></path></svg> : null}
                        </button>
                    </div>
                    {activeAction === 'sort'
                    ? <SortActionCard sortActions={sortActions} setSortActions={setSortActions} setActiveAction={setActiveAction} viewActionBtn={viewActionBtnRef.current} /> : activeAction === 'view'
                    ? <NotelistViewActionCard viewActions={viewActions} setViewActions={setViewActions} setActiveAction={setActiveAction} sortActionBtn={sortActionBtnRef.current} getNotes={getNotes} /> : null}
                </div>
            </header>
            <div className="notelist-body-wrapper">
                {notelistReady ?
                    <ul ref={notelistBody} style={{ height: `${!isView('Top list') ? `${window.innerHeight - 95}px` : '100%'}` }} className={`notelist-body ${view.toLowerCase().replaceAll(' ', '-')}-container ${!getNotes().length ? 'empty' : ''}`}>
                        {!['Cards', 'Snippets'].includes(view) && (
                            <div className="table-head">
                                <div style={{ width: '100px' }} className="title-col-th">Title<span className="resizer title-col-resizer"></span></div>
                                {viewActions.dateUpdated && <div style={{ width: '100px' }} className="date-updated-col-th">updated<span className="resizer date-updated-col-resizer"></span></div>}
                                {viewActions.dateCreated && <div style={{ width: '100px' }} className="date-created-col-th">created<span className="resizer date-created-col-resizer"></span></div>}
                            </div>
                        )}
                        {getNotes().length ?
                            getNotes().map((noteObj, index, noteObjArr) => {
                                const { _id: id, title, summaryText, updatedAt, createdAt } = noteObj
                                const prop = sortByToProp(sortBy)
                                const currentGroup = ['title'].includes(prop) ? noteObj[prop][0].toUpperCase() : dateToLocaleString(noteObj[prop])
                                const previousGroup = ['title'].includes(prop) ? noteObjArr[index-1]?.[prop][0].toUpperCase() : dateToLocaleString(noteObjArr[index-1]?.[prop])
                                if (snig && (index === 0 || currentGroup !== previousGroup)) {
                                    return <React.Fragment key={createdAt}>
                                        <li className="meta">{currentGroup}</li>
                                        <NotelistItem viewActions={viewActions} key={createdAt} createdAt={createdAt} id={id} title={title} summaryText={summaryText} updatedAt={updatedAt} />        
                                    </React.Fragment>
                                }
                                return <NotelistItem viewActions={viewActions} key={createdAt} createdAt={createdAt} id={id} title={title} summaryText={summaryText} updatedAt={updatedAt} />
                            } ) : (
                            // work on snig here
                            <li className="notelist-empty-state">
                                {activeNotelist !== 'Trash' ?
                                <span className="write-note-icon">
                                    <svg width="200" height="160" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M122.319 109.982a3.556 3.556 0 01-1.79.995l-12.927 2.813c-.247.054-.497.08-.744.08a3.54 3.54 0 01-2.592-1.137 3.738 3.738 0 01-.875-3.466l3.25-12.731c.065-.254.163-.496.277-.728h-32.83c-1.243 0-2.253-1.035-2.253-2.308s1.01-2.308 2.252-2.308h37.074L142 59.582V53.56c0-7.489-5.923-13.56-13.23-13.56H71.23C63.923 40 58 46.071 58 53.561v79.878C58 140.929 63.923 147 71.23 147h57.54c7.307 0 13.23-6.071 13.23-13.561v-43.63l-19.681 20.173zM74.087 63.734h51.826c1.242 0 2.252 1.035 2.252 2.308 0 1.272-1.01 2.308-2.252 2.308H74.087c-1.242 0-2.252-1.036-2.252-2.309 0-1.272 1.01-2.307 2.252-2.307zm51.826 59.533H74.087c-1.242 0-2.252-1.036-2.252-2.309 0-1.272 1.01-2.307 2.252-2.307h51.826c1.242 0 2.252 1.035 2.252 2.308 0 1.272-1.01 2.308-2.252 2.308z" fill="currentColor"></path><path d="M171.335 55.574l-51.218 51.62L107 110l3.298-12.702 51.218-51.62a5.652 5.652 0 018.037 0l1.782 1.796a5.758 5.758 0 010 8.1z" fill="#A6A6A6"></path><path opacity=".6" d="M168.417 146.602l2.679 1.956a.935.935 0 01.332 1.046l-1.031 3.172a.935.935 0 00.333 1.046.91.91 0 001.084-.002l2.664-1.978a.906.906 0 011.083.004l2.659 1.974a.915.915 0 001.085.002.939.939 0 00.333-1.046l-1.033-3.178a.94.94 0 01.338-1.043l2.674-1.953a.934.934 0 00.337-1.044.914.914 0 00-.878-.644l-3.302.013a.912.912 0 01-.741-.382.937.937 0 01-.134-.266l-1.006-3.181a.917.917 0 00-1.752 0l-1.006 3.181a.912.912 0 01-.874.648l-3.303-.013c-.422.026-.759.273-.878.644a.935.935 0 00.337 1.044zM71.505 12.743a2.314 2.314 0 01-1.65-.692l-3.142-3.185a2.385 2.385 0 010-3.341 2.31 2.31 0 013.297 0l1.495 1.513 5.276-5.346a2.31 2.31 0 013.298 0c.91.923.91 2.419 0 3.342l-6.926 7.017a2.309 2.309 0 01-1.648.692z" fill="#C097DF"></path><path opacity=".6" d="M24.78 128.714a.972.972 0 00.966-.979v-6.483h2.886a.972.972 0 00.966-.978.98.98 0 00-.178-.563.999.999 0 00-.105-.131v.002l-5.348-5.234a.949.949 0 00-.67-.273.949.949 0 00-.669.273l-5.345 5.234v-.002a.999.999 0 00-.105.131.98.98 0 00-.178.563c0 .54.432.978.966.978h2.883v6.483c0 .541.433.979.966.979h2.966z" fill="#FB4B00"></path></svg>
                                </span> :
                                <span className="trash-icon">
                                    <svg width="200" height="160" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M52.956 49.479c-1.955 0-3.54-1.566-3.54-3.498 0-1.933 1.587-3.5 3.542-3.498l24.763.019v-12.25c0-4.835 2.162-8.752 7.143-8.752h28.292c4.981 0 7.087 3.895 7.087 8.73v12.25h24.8c1.955 0 3.54 1.567 3.54 3.5 0 1.932-1.585 3.499-3.54 3.499H52.956zm31.877-15.763c0-.967.793-1.75 1.771-1.75h24.792a1.76 1.76 0 011.771 1.75v7.016a1.76 1.76 0 01-1.771 1.75H86.604a1.76 1.76 0 01-1.77-1.75v-7.016zm36.705 92.784c4.981 0 9.015-1.711 9.015-6.547l3.87-63.45H63.559l3.888 61.245c0 4.836 4.035 8.752 9.016 8.752h45.075z" fill="currentColor"></path></svg>
                                </span>}
                                <p className="intro">{activeNotelist !== 'Trash' ? 'It all begins with notes' : 'Your trash is empty'}</p>
                                <p className="info">
                                {activeNotelist !== 'Trash' ?
                                <React.Fragment>Click the <a onClick={(ev) => {ev.preventDefault(); createNewNote()}} href='/'>+ New Note</a> button in the sidebar to create a note.</React.Fragment>
                                : "When you have notes in the trash, click '...' to restore or delete them." }
                                </p>
                            </li>
                        )}
                    </ul>
                : <p>Loading...</p>}
            </div>
        </div>
    )
}

export default Notelist
