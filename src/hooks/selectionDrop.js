import { useEffect } from 'react'
import { allDocument } from '../utils/utilFuncs'

function useSelectionDrop({ cardRef, exSelector, setSelectionDropTool }) {
    useEffect(() => {
        const disappear = (ev) => {
            if (!ev.path.includes(cardRef.current)) {
                const otherEditTools = document.querySelectorAll(`.tool-bar button:not(.${exSelector})`)
                if ([...otherEditTools].some((elem) => ev.path.includes(elem))) return
                setSelectionDropTool({ tool: null })
                return
            }
        }
        allDocument.addEventListener('click', disappear)
        
        return () => {
            allDocument.removeEventListener('click', disappear)
        }
    }, [setSelectionDropTool, cardRef, exSelector])

    return null;
}

export default useSelectionDrop
