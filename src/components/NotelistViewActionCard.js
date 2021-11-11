import React from 'react'
import './NotelistViewActionCard.scss'

function NotelistViewActionCard({ viewActions, setViewActions }) {
    return (
        <div className="notelist-view-action-card">
        <h5>NOTE LIST VIEW</h5>
        <ul>
            {[['Cards', <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12.375 8.92V5.25H9.437v3.67h2.938zm0 1.25H9.437v3.655h2.938V10.17zm0 4.905H9.437v3.675h2.938v-3.675zM6 20a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6zm7.625-14.75H18a.75.75 0 01.75.75v12a.75.75 0 01-.75.75h-4.375V5.25zM5.25 8.92V6A.75.75 0 016 5.25h2.188v3.67H5.25zm0 1.25v3.655h2.938V10.17H5.25zm2.938 4.905H5.25V18c0 .414.336.75.75.75h2.188v-3.675z" fill="currentColor"></path></svg>],
            ['Snippets', <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12.375 8.925V5.25H6a.75.75 0 00-.75.75v2.925h7.125zm0 1.25H5.25v3.65h7.125v-3.65zm0 4.9H5.25V18c0 .414.336.75.75.75h6.375v-3.675zM6 20a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6zm7.625-14.75H18a.75.75 0 01.75.75v12a.75.75 0 01-.75.75h-4.375V5.25z" fill="currentColor"></path></svg>],
            ['Side list', <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12.375 6.95v-1.7H6a.75.75 0 00-.75.75v.95h7.125zm0 1.25H5.25v1.705h7.125V8.2zm0 2.955H5.25v1.7h7.125v-1.7zm0 2.95H5.25v1.7h7.125v-1.7zm0 2.95H5.25V18c0 .414.336.75.75.75h6.375v-1.695zM6 20a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6zm7.625-14.75H18a.75.75 0 01.75.75v12a.75.75 0 01-.75.75h-4.375V5.25z" fill="currentColor"></path></svg>],
            ['Top list', <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4 18a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12zM5.25 6A.75.75 0 016 5.25h12a.75.75 0 01.75.75v.95H5.25V6zm0 2.2v1.705h13.5V8.2H5.25zm0 2.955h13.5V18a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75v-6.845z" fill="currentColor"></path></svg>]]
            .map(([optionText, icon]) => (
                <li key={optionText} className={viewActions.view === optionText ? 'checked' : ''}>
                    <button>
                        <span className="check-mark-icon">
                            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M17.572 6.35a1.013 1.013 0 011.531 1.325l-8.212 9.488a1.013 1.013 0 01-1.532 0L5.497 12.7a1.012 1.012 0 111.531-1.325l3.097 3.578 7.447-8.603z" fill="currentColor"></path></svg>
                        </span>
                        <span className="option-text">
                            {icon}
                            <span>{optionText}</span>
                        </span>
                    </button>
                </li>
            ))}
        </ul>
        {['Cards', 'Snippets'].includes(viewActions.view)
        ? (
            <React.Fragment>
            <h5 className="sub-options-h">NOTE PREVIEW</h5>
            <ul>
                {['Show images', 'Show body text'].map((optionText) => (
                <li key={optionText} className={viewActions.showImages && optionText === 'Show images' ? 'checked' : viewActions.showBodyText && optionText === 'Show body text' ? 'checked' : ''}>
                    <button>
                        <span className="check-mark-icon">
                            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M17.572 6.35a1.013 1.013 0 011.531 1.325l-8.212 9.488a1.013 1.013 0 01-1.532 0L5.497 12.7a1.012 1.012 0 111.531-1.325l3.097 3.578 7.447-8.603z" fill="currentColor"></path></svg>
                        </span>
                        <span className="option-text">{optionText}</span>
                    </button>
                </li>
                ))}
            </ul>
            </React.Fragment>
        ) : (
            <React.Fragment>
            <h5 className="sub-options-h">COLUMNS</h5>
            <ul>
                {[['Show images', viewActions.showImages],
                ['Show body text', viewActions.showBodyText]].map(([optionText, optionValidate]) => (
                <li key={optionText} className={optionValidate ? 'checked' : ''}>
                    <button>
                        <span className="check-mark-icon">
                            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M17.572 6.35a1.013 1.013 0 011.531 1.325l-8.212 9.488a1.013 1.013 0 01-1.532 0L5.497 12.7a1.012 1.012 0 111.531-1.325l3.097 3.578 7.447-8.603z" fill="currentColor"></path></svg>
                        </span>
                        <span className="option-text">{optionText}</span>
                    </button>
                </li>
                ))}
            </ul>
            </React.Fragment>
        )}
        </div>
    )
}

export default NotelistViewActionCard
