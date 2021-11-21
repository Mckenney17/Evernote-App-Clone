import { useEffect } from "react"
import { allDocument } from "../utils/utilFuncs"

const useNotelistActionsDrop = ({ cardRef, setActiveAction, otherActionBtn }) => {
    useEffect(() => {
        const disappear = (ev) => {
            if (!ev.path.includes(cardRef.current)) {
                if (ev.path.includes(otherActionBtn)) return
                setActiveAction(null)
                return
            }
        }
        allDocument.addEventListener('click', disappear)

        return () => {
            allDocument.removeEventListener('click', disappear)
        }
    }, [setActiveAction, otherActionBtn, cardRef])
}

export default useNotelistActionsDrop