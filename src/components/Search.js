import React from 'react'
import './Search.scss'

function Search() {
    return (
        <div className="input-wrapper">
            <span className="search-icon">
            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" class="C1Pw2rSHz9BEf3xLKAgU"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.959 15.127c-2.294 1.728-5.577 1.542-7.68-.556-2.303-2.297-2.318-6.02-.034-8.312 2.285-2.293 6.004-2.29 8.307.009 2.103 2.097 2.299 5.381.579 7.682a.86.86 0 01.055.05l4.028 4.035a.834.834 0 01-1.179 1.179l-4.028-4.035a.869.869 0 01-.048-.052zm-.553-1.725c-1.63 1.635-4.293 1.641-5.95-.012s-1.66-4.318-.03-5.954c1.629-1.635 4.293-1.64 5.95.013 1.657 1.653 1.659 4.318.03 5.953z" fill="currentColor"></path></svg>
            </span>
            <input type="text" aria-roledescription="search" placeholder="Search" aria-placeholder="Search" />
        </div>
    )
}

export default Search
