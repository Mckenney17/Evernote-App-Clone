import React from 'react'
import { camelCase, capitalize } from '../utils/utilFuncs'
import './ToolBar.scss'
import TextLevelsCard from './TextLevelsCard'
import FontSizeCard from './FontSizeCard'
import FontFamiliesCard from './FontFamiliesCard'
import ForeColorsCard from './ForeColorsCard'
import BackColorsCard from './BackColorsCard'
import useFormatting from '../hooks/useFormatting'

function ToolBar({
    toolsState,
    setToolsState,
    selColor,
    setSelColor,
    history,
    setHistory,
    selectionDropTool,
    setSelectionDropTool,
    toolbarActive,
}) {
    const tools = {
        allNames: ['insert', ['undo', 'redo'], 'text-level', 'super-family', 'font-size', ['fore-color', 'bold', 'italic', 'underline', 'back-color'], ['unordered-list', 'ordered-list'], 'insert-link', ['left-align', 'center-align', 'right-align', 'indent', 'outdent'], ['strikethrough', 'superscript', 'subscript']],
        allIcons: [<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM11 9v2H9a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V9a1 1 0 10-2 0z"></path></svg>,
            [
                <svg className={history.undo ? 'active' : 'inactive'} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M10.739 4.683a.625.625 0 010 .884L8.705 7.6l4.823-.015a5.948 5.948 0 01.001 11.895l-8.403.02a.625.625 0 01-.002-1.25l8.403-.02h.001a4.697 4.697 0 00.001-9.395l-4.833.015 2.043 2.043a.625.625 0 01-.884.884L6.75 8.672a.625.625 0 010-.884l3.105-3.105a.625.625 0 01.884 0z"></path></svg>,
                <svg className={history.redo ? 'active' : 'inactive'} style={{ transform: 'rotateY(180deg)' }} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M10.739 4.683a.625.625 0 010 .884L8.705 7.6l4.823-.015a5.948 5.948 0 01.001 11.895l-8.403.02a.625.625 0 01-.002-1.25l8.403-.02h.001a4.697 4.697 0 00.001-9.395l-4.833.015 2.043 2.043a.625.625 0 01-.884.884L6.75 8.672a.625.625 0 010-.884l3.105-3.105a.625.625 0 01.884 0z"></path></svg>,
            ],
            <React.Fragment>{toolsState.textLevel}<svg width="8" height="24" viewBox="0 0 8 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M4 13.293L6.293 11a.5.5 0 01.707.707l-2.695 2.695a.431.431 0 01-.61 0L1 11.707A.5.5 0 111.707 11L4 13.293z"></path></svg></React.Fragment>,
            <React.Fragment>{toolsState.superFamily}<svg width="8" height="24" viewBox="0 0 8 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M4 13.293L6.293 11a.5.5 0 01.707.707l-2.695 2.695a.431.431 0 01-.61 0L1 11.707A.5.5 0 111.707 11L4 13.293z"></path></svg></React.Fragment>,
            <React.Fragment>{toolsState.fontSize}<svg width="8" height="24" viewBox="0 0 8 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M4 13.293L6.293 11a.5.5 0 01.707.707l-2.695 2.695a.431.431 0 01-.61 0L1 11.707A.5.5 0 111.707 11L4 13.293z"></path></svg></React.Fragment>,
            [
                <React.Fragment><span><span className="circle" style={{ background: selColor.fore }}></span></span><svg className="chevron" width="20" height="24" viewBox="0 0 8 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M4 13.293L6.293 11a.5.5 0 01.707.707l-2.695 2.695a.431.431 0 01-.61 0L1 11.707A.5.5 0 111.707 11L4 13.293z"></path></svg></React.Fragment>,
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fillRule="evenodd" d="M9.125 6C8.504 6 8 6.504 8 7.125v10c0 .621.504 1.125 1.125 1.125h4.5a3.625 3.625 0 002.027-6.63A3.625 3.625 0 0012.625 6h-3.5zm1.125 5V8.25h2.375a1.375 1.375 0 010 2.75H10.25zm0 5v-2.75h3.375a1.375 1.375 0 010 2.75H10.25z"></path></svg>,
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M9.5 6a.625.625 0 100 1.25h3.182L10.022 17H6.5a.625.625 0 100 1.25h8a.625.625 0 100-1.25h-3.182l2.66-9.75H17.5a.625.625 0 100-1.25h-8z"></path></svg>,
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M8.5 5.734a.625.625 0 00-.625.625v5.5a4.125 4.125 0 008.25 0v-5.5a.625.625 0 10-1.25 0v5.5a2.875 2.875 0 01-5.75 0v-5.5a.625.625 0 00-.625-.625zM5.5 17.734a.625.625 0 100 1.25h13a.625.625 0 100-1.25h-13z"></path></svg>,
                <React.Fragment>
                    <span>
                        <svg width="24" height="24"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill={selColor.back} d="M9.4 7.345a.8.8 0 01.492-.738l3.598-1.5a.8.8 0 011.108.74v5.311H9.4V7.345z"></path></svg>
                        <svg width="24" height="24"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M9.4 14.38v-2.02h5.2v2.02c0 .319.11.63.31.878l1.246 1.544a.2.2 0 01.044.126v1.13a.6.6 0 101.2 0v-1.13c0-.32-.11-.63-.31-.88l-1.246-1.543a.2.2 0 01-.044-.126v-2.218a1 1 0 00-1-1H9.2a1 1 0 00-1 1v2.218a.2.2 0 01-.044.126L6.91 16.049a1.4 1.4 0 00-.31.879v1.13a.6.6 0 101.2 0v-1.13a.2.2 0 01.044-.126l1.246-1.544c.2-.249.31-.559.31-.879z"></path></svg>
                    </span>
                    <svg className="chevron" width="20" height="24" viewBox="0 0 8 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M4 13.293L6.293 11a.5.5 0 01.707.707l-2.695 2.695a.431.431 0 01-.61 0L1 11.707A.5.5 0 111.707 11L4 13.293z"></path></svg>
                </React.Fragment>,
            ],
            [
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M5.39 6.254a1.375 1.375 0 100 2.75 1.375 1.375 0 000-2.75zM10.39 7.004a.625.625 0 100 1.25h8a.625.625 0 100-1.25h-8zM5.39 11.258a1.375 1.375 0 100 2.75 1.375 1.375 0 000-2.75zM10.39 12.008a.625.625 0 100 1.25h8a.625.625 0 100-1.25h-8zM5.39 16.255a1.375 1.375 0 100 2.75 1.375 1.375 0 000-2.75zM10.39 17.005a.625.625 0 100 1.25h8a.625.625 0 100-1.25h-8z"></path></svg>,
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M5.424 6.29a.709.709 0 00-.555.267L3.432 8.37a.625.625 0 10.98.777l.471-.594v3.356a.625.625 0 101.25 0v-4.91a.709.709 0 00-.709-.709zM4.624 15.742a.625.625 0 11-1.201-.344l.007-.026a1.97 1.97 0 01.093-.246c.064-.15.167-.352.32-.557.307-.414.857-.88 1.705-.858.485.013.95.183 1.298.517.353.339.547.808.552 1.336.01.89-.622 1.57-1.122 2.026-.203.185-.422.365-.616.524l-.168.138-.023.02 1.675-.014a.625.625 0 01.01 1.25l-2.98.024-.046-.007h-.006l-.028-.005a.625.625 0 01-.14-.045.663.663 0 01-.234-.175.7.7 0 01-.151-.578c.024-.143.086-.272.15-.38.067-.114.159-.243.28-.392m0 0c.192-.235.455-.461.695-.66l.19-.157c.19-.155.373-.306.55-.467.5-.455.717-.8.714-1.089-.002-.221-.077-.36-.167-.447-.095-.09-.248-.163-.467-.17-.308-.008-.512.143-.669.355a1.552 1.552 0 00-.213.404l-.007.022M11.39 7.008a.625.625 0 100 1.25h8a.625.625 0 100-1.25h-8zM11.39 12.012a.625.625 0 100 1.25h8a.625.625 0 100-1.25h-8zM11.39 17.009a.625.625 0 100 1.25h8a.625.625 0 100-1.25h-8z"></path></svg>
            ],
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M17.156 6.799a2.8 2.8 0 00-3.96 0L11.35 8.645a2.766 2.766 0 000 3.911l.024.024a.6.6 0 11-.848.849l-.024-.024a3.966 3.966 0 010-5.609l1.846-1.846a4 4 0 015.656 5.657l-1.07 1.07a.6.6 0 11-.848-.849l1.07-1.07a2.8 2.8 0 000-3.96zm-4.53 3.772a.6.6 0 01.848 0l.024.024a3.966 3.966 0 010 5.61l-1.846 1.845a4 4 0 11-5.656-5.657l1.07-1.07a.6.6 0 01.848.85l-1.07 1.069a2.8 2.8 0 103.96 3.96l1.846-1.846a2.766 2.766 0 000-3.912l-.024-.024a.6.6 0 010-.849z"></path></svg>,
            [
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M7.5 8a.625.625 0 100 1.25h11a.625.625 0 100-1.25h-11zM7.5 12a.625.625 0 100 1.25h7a.625.625 0 100-1.25h-7zM7.5 16a.625.625 0 100 1.25h11a.625.625 0 100-1.25h-11z"></path></svg>,
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M7.5 8a.625.625 0 100 1.25h11a.625.625 0 100-1.25h-11zM9.5 12a.625.625 0 100 1.25h7a.625.625 0 100-1.25h-7zM7.5 16a.625.625 0 100 1.25h11a.625.625 0 100-1.25h-11z"></path></svg>,
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M7.5 8a.625.625 0 100 1.25h11a.625.625 0 100-1.25h-11zM11.5 12a.625.625 0 100 1.25h7a.625.625 0 100-1.25h-7zM7.5 16a.625.625 0 100 1.25h11a.625.625 0 100-1.25h-11z"></path></svg>,
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M7.5 7a.625.625 0 100 1.25h10a.625.625 0 100-1.25h-10zM9.796 10.537a.625.625 0 10-.884.884l.615.615H5.5a.625.625 0 000 1.25h3.956l-.544.543a.625.625 0 00.884.884l1.786-1.786a.428.428 0 000-.604l-1.786-1.786zM13.5 12.036a.625.625 0 000 1.25h4a.625.625 0 100-1.25h-4zM7.5 17.071a.625.625 0 100 1.25h10a.625.625 0 100-1.25h-10z"></path></svg>,
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M7.5 7a.625.625 0 100 1.25h10a.625.625 0 100-1.25h-10zM7.088 10.608a.625.625 0 00-.884 0l-1.786 1.786a.428.428 0 000 .605l1.786 1.786a.625.625 0 10.884-.884l-.615-.615H10.5a.625.625 0 100-1.25H6.545l.543-.544a.625.625 0 000-.884zM13.5 12.036a.625.625 0 000 1.25h4a.625.625 0 100-1.25h-4zM7.5 17.071a.625.625 0 100 1.25h10a.625.625 0 100-1.25h-10z"></path></svg>,
            ],
            [
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M11.806 6.516a3.43 3.43 0 00-2.319.901l-.04.038a3.304 3.304 0 00-.298 4.56H5.5a.625.625 0 100 1.25h6.694a2.18 2.18 0 011.474.574l.041.037a2.055 2.055 0 010 3.029l-.041.037a2.18 2.18 0 01-1.474.574H12a2.68 2.68 0 01-1.811-.705l-.398-.365a.625.625 0 00-.845.922l.398.365A3.93 3.93 0 0012 18.766h.194c.859 0 1.686-.322 2.319-.902l.04-.038a3.304 3.304 0 00.298-4.56H18.5a.625.625 0 100-1.25h-6.694a2.18 2.18 0 01-1.474-.574l-.04-.037a2.054 2.054 0 010-3.029l.04-.037a2.18 2.18 0 011.474-.573H12c.67 0 1.317.251 1.811.704l.398.365a.625.625 0 00.845-.922l-.398-.364A3.93 3.93 0 0012 6.516h-.194z"></path></svg>,
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M14.4 6.859v.001a.6.6 0 101.2.002.972.972 0 01.098-.346c.133-.246.4-.316.665-.316.268 0 .537.072.673.32.109.198.127.403.003.598-.184.288-.457.485-.73.682l-.168.122c-.733.548-1.16 1.049-1.408 1.44-.213.333-.497.86-.193 1.224a.6.6 0 00.46.214h3a.6.6 0 000-1.2h-1.942c.291-.323.629-.585.982-.835.387-.273.755-.6 1.01-1.002.175-.274.294-.593.288-.922a2.043 2.043 0 00-.25-.9 1.752 1.752 0 00-.622-.655C17.167 5.102 16.8 5 16.363 5c-.437 0-.804.102-1.103.286a1.735 1.735 0 00-.617.66c-.15.278-.236.596-.243.913zM12.382 15.863a.6.6 0 01-.845-.082L9.2 12.944 6.863 15.78a.6.6 0 11-.926-.762L8.423 12 5.937 8.981a.6.6 0 11.926-.762L9.2 11.056l2.337-2.837a.6.6 0 01.926.762L9.977 12l2.486 3.018a.6.6 0 01-.081.845z"></path></svg>,
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12.382 15.863a.6.6 0 01-.845-.082L9.2 12.944 6.863 15.78a.6.6 0 11-.926-.763L8.423 12 5.937 8.98a.6.6 0 11.926-.763L9.2 11.056l2.337-2.837a.6.6 0 01.926.762L9.977 12l2.486 3.018a.6.6 0 01-.081.845zM14.4 14.459a.6.6 0 101.2.002.972.972 0 01.098-.345c.133-.246.4-.316.665-.316.268 0 .537.072.673.32.109.198.127.403.003.598-.184.288-.457.485-.73.682l-.168.122c-.733.548-1.16 1.049-1.408 1.44-.213.333-.497.86-.193 1.224a.6.6 0 00.46.214h3a.6.6 0 000-1.2h-1.942c.291-.323.629-.585.982-.835.387-.273.755-.6 1.01-1.002.175-.274.294-.593.288-.922a2.043 2.043 0 00-.25-.9 1.752 1.752 0 00-.622-.655c-.299-.184-.666-.286-1.103-.286-.437 0-.804.102-1.103.286a1.735 1.735 0 00-.617.66c-.15.277-.236.596-.243.913z"></path></svg>,
            ]],
    }
    const execCommand = (fs, sdu = false, vArg = null) => {
        const iframe = document.querySelector('iframe')
        const iframeDocument = iframe.contentDocument
        // iframeDocument.execCommand('styleWithCSS', false, true)
        iframeDocument.execCommand(fs, sdu, vArg)
    }
    const format = useFormatting({ execCommand, setSelectionDropTool, setToolsState, toolsState, setHistory })

    return (
        <div className={`tool-bar ${toolbarActive ? '' : 'inactive'}`}>
            {tools.allNames.map((toolName, i) => {
            const checkables = ['fore-color', 'bold', 'italic', 'underline', 'back-color', 'unordered-list', 'ordered-list', 'strikethrough', 'superscript', 'subscript']
            return Array.isArray(toolName) ?
            <React.Fragment key={`tni-${i}`}>
                {toolName.map((toolNameInner, j) => (
                    <React.Fragment key={`tni-${j}`}>
                        <button onClick={(ev) => {
                            if (['fore-color', 'back-color'].includes(toolNameInner) && !ev.nativeEvent.path[0].classList.contains('chevron')) {
                                format(toolNameInner)
                            } else if(['fore-color', 'back-color'].includes(toolNameInner) && ev.nativeEvent.path[0].classList.contains('chevron')) {
                                setSelectionDropTool({ tool: toolNameInner })
                            } else {
                                format(toolNameInner)
                            }
                        }} title={capitalize(toolNameInner.split('-').join(' '))} className={`${toolNameInner}${checkables.includes(toolNameInner) && toolsState[camelCase(toolNameInner)] ? ' checked' : ''}`}>{tools.allIcons[i][j]}</button>
                    </React.Fragment>
                ))}
                <span className="divider">&nbsp;</span>
            </React.Fragment>
            : <React.Fragment key={`tni-${i}`}>
                <button onClick={() => setSelectionDropTool({ tool: toolName })} title={capitalize(toolName.split('-').join(' '))} className={`${toolName}${checkables.includes(toolName) && toolsState[camelCase(toolName)] ? ' checked' : ''}`}>{tools.allIcons[i]}</button>
                <span className="divider">&nbsp;</span>
            </React.Fragment>
            })}
            {selectionDropTool === 'text-level' ?
                <TextLevelsCard format={format} setSelectionDropTool={setSelectionDropTool} toolsState={toolsState} setToolsState={setToolsState} /> :
            selectionDropTool === 'super-family' ?
                <FontFamiliesCard format={format} setSelectionDropTool={setSelectionDropTool} toolsState={toolsState} setToolsState={setToolsState} /> :
            selectionDropTool === 'font-size' ?
                <FontSizeCard format={format} setSelectionDropTool={setSelectionDropTool} toolsState={toolsState} setToolsState={setToolsState} /> :
            selectionDropTool === 'fore-color' ?
                <ForeColorsCard selColor={selColor} setSelColor={setSelColor} setSelectionDropTool={setSelectionDropTool} toolsState={toolsState} setToolsState={setToolsState} /> :
            selectionDropTool === 'back-color' ?
                <BackColorsCard selColor={selColor} setSelColor={setSelColor} setSelectionDropTool={setSelectionDropTool} toolsState={toolsState} setToolsState={setToolsState} /> 
            : null}
        </div>
    )
}

export default ToolBar
