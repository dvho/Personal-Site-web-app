import React from 'react'

const InfoSheet = props => {

        if (props.screenWidth === 0) { //This prevents the unnecesary render caused by App.js not yet having its state set in componentDidMount when the first render happens
            return
        }

        let left = props.wideScreen ? props.margin + props.canvasWidth - 270 : props.screenWidth - 270
        let height = props.canvasHeight * .8
        let className = props.revealInfoSheet ? 'info-sheet-container info-sheet-container-revealed' : 'info-sheet-container'

        return(
            <div className={className} style={{left: left, height: height}}>
                <h1 className='info-sheet-heading'>How did I build this?</h1>
                <p>I built this app with React (and ReactPlayer for the audio component). There are no other dependencies! Play any of my songs (still works in progress) from the interface below or click their titles.</p>
                <p>When clouds outside pass in front of the moon they dim the moonlight entering the room and reveal my animated face, which you can interact with by mouse or touch. The visibility of my face is commensurate with the darkness of the room at any given moment. </p>
                <p>Click the contact menu on the left to send me an email, view my resume, or check out some of my other projects on GitHub and NPM. You can toggle the performance button at the top right to add haziness to the clouds, the default for which is off since this does strain your GPU.</p>
            </div>
        )
}

export default React.memo(InfoSheet) //I'm wrapping the export of the component in React.memo, which does a shallow comparison for function components as React.PureComponent, or the older lifecycle method componentShouldUpdate(), do shallow comparisons to limit unnecessary re-rendering in class components. One could also simply wrap the code block of the component itself in React.memo but I think doing it in the export is cleaner.
