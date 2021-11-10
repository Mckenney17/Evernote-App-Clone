import React, { useContext, useEffect } from 'react'
import AppContext from '../utils/AppContext'
import './Notelist.scss'

function Notelist() {
    const { activeTab, notelistView } = useContext(AppContext)

    useEffect(() => {
        const resize = (ev) => {
            document.querySelector('.notelist').style.width = `${ev.clientX - document.querySelector('.sidebar').getBoundingClientRect().width}px`
        }
        const resizer = document.querySelector('.notelist-resizer');
        resizer.addEventListener('mousedown', (ev) => {
            document.addEventListener('mousemove', resize, false)
        }, false)
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', resize, false)
        }, false)
    }, [])

    return (
        <div className="notelist">
            <span className="notelist-resizer"></span>
            <header>
                <div className="title">
                    <span class="title-icon">
                        {activeTab === 'Notes'
                        ? <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M7.665 4.5h8.75c.92 0 1.667.746 1.667 1.667v8.748h-3.334a.625.625 0 00-.625.624v3.958H7.665c-.92 0-1.667-.747-1.667-1.667V6.167c0-.92.747-1.667 1.667-1.667zm7.037 4.584a.625.625 0 100-1.25H9.298a.625.625 0 100 1.25h5.404zm.625 2.918c0 .345-.28.625-.625.625H9.298a.625.625 0 010-1.25h5.404c.345 0 .625.28.625.625zm-4.363 4.158a.625.625 0 100-1.25H9.298a.625.625 0 100 1.25h1.666z" fill="currentColor"></path><path d="M15.373 16.164h2.157l-2.107 2.693-.05.06v-2.753z" fill="currentColor"></path></svg>
                        : <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.298 17.93l.494-8.846H7.208l.514 8.85c.05.88.78 1.57 1.664 1.57h5.248c.885 0 1.615-.692 1.664-1.575z" fill="currentColor"></path><path fillRule="evenodd" clipRule="evenodd" d="M11.167 4.087a2.292 2.292 0 00-2.292 2.291v.205H5.75a.625.625 0 100 1.25h12.5a.625.625 0 100-1.25h-3.125v-.205a2.292 2.292 0 00-2.292-2.291h-1.666zm2.708 2.496v-.205c0-.575-.466-1.041-1.042-1.041h-1.666c-.576 0-1.042.466-1.042 1.041v.205h3.75z" fill="currentColor"></path></svg>}
                    </span>
                    <span>{activeTab}</span>
                </div>
                <div className="subheader">
                    <span className="notelist-count">0 notes</span>
                    <div className="notelist-actions" role="toolbar">
                        <button className="sort-notelist">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.183 4.625a.625.625 0 00-1.25 0V17.87L5.067 16a.625.625 0 00-.884 0 .62.62 0 000 .88l2.933 2.94c.244.244.64.244.884 0l2.933-2.94a.62.62 0 000-.88.625.625 0 00-.884 0l-1.866 1.87V4.625zM11.625 5a.625.625 0 100 1.25h8.75a.625.625 0 100-1.25h-8.75zM11 9.375c0-.345.28-.625.625-.625h6.25a.625.625 0 110 1.25h-6.25A.625.625 0 0111 9.375zM11.625 12.5a.625.625 0 100 1.25h3.75a.625.625 0 100-1.25h-3.75z" fill="currentColor"></path></svg>
                        </button>
                        <button className="change-notelist-view">
                            {notelistView.view === 'Snippets'
                            ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.375 8.925V5.25H6a.75.75 0 00-.75.75v2.925h7.125zm0 1.25H5.25v3.65h7.125v-3.65zm0 4.9H5.25V18c0 .414.336.75.75.75h6.375v-3.675zM6 20a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6zm7.625-14.75H18a.75.75 0 01.75.75v12a.75.75 0 01-.75.75h-4.375V5.25z" fill="currentColor"></path></svg> : notelistView.view === 'Cards'
                            ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.375 8.92V5.25H9.437v3.67h2.938zm0 1.25H9.437v3.655h2.938V10.17zm0 4.905H9.437v3.675h2.938v-3.675zM6 20a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6zm7.625-14.75H18a.75.75 0 01.75.75v12a.75.75 0 01-.75.75h-4.375V5.25zM5.25 8.92V6A.75.75 0 016 5.25h2.188v3.67H5.25zm0 1.25v3.655h2.938V10.17H5.25zm2.938 4.905H5.25V18c0 .414.336.75.75.75h2.188v-3.675z" fill="currentColor"></path></svg> : notelistView.view === 'Side list'
                            ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.375 6.95v-1.7H6a.75.75 0 00-.75.75v.95h7.125zm0 1.25H5.25v1.705h7.125V8.2zm0 2.955H5.25v1.7h7.125v-1.7zm0 2.95H5.25v1.7h7.125v-1.7zm0 2.95H5.25V18c0 .414.336.75.75.75h6.375v-1.695zM6 20a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6zm7.625-14.75H18a.75.75 0 01.75.75v12a.75.75 0 01-.75.75h-4.375V5.25z" fill="currentColor"></path></svg> : notelistView.view === 'Top list'
                            ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 18a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12zM5.25 6A.75.75 0 016 5.25h12a.75.75 0 01.75.75v.95H5.25V6zm0 2.2v1.705h13.5V8.2H5.25zm0 2.955h13.5V18a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75v-6.845z" fill="currentColor"></path></svg> : null}
                        </button>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default Notelist
