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
                <p>I built this app with React. Play any of my songs (still works in progress) from the interface below or click on their titles. With mouse or touch hold down on a title to navigate to that song's discrete page with lyrics. With my custom ML phantom hand controller you can control both the audio interface below, the menu to the left and most of its options without touching the screen, keys or mouse.</p>
                <p>As for the installation art, when the clouds outside pass in front of the moon they dim the moonlight entering the room and further reveal my animated face, which you can interact with by mouse, touch or phantom hand. The visibility of my face is commensurate with the darkness of the room at any given moment.</p>
                <p>Click the options in the menu to the left to send me an email, view my resume, or check out some of my other projects on GitHub and NPM. From there you can also toggle the clouds, cloud haze or phantom hand.</p>
                <p>Notes: Cloud haze is turned off by default as it does strain the GPU. Use of the phantom hand with the cloud haze turned on imposes even more strain (which will be evident if you try). It's intentional that toggling the phantom hand on/off can only be done with mouse or touch as turning the phantom hand on with the phantom hand itself is paradoxically impossible.</p>
            </div>
        )
}

export default React.memo(InfoSheet) //I'm wrapping the export of the component in React.memo, which does a shallow comparison for function components as React.PureComponent, or the older lifecycle method componentShouldUpdate(), do shallow comparisons to limit unnecessary re-rendering in class components. One could also simply wrap the code block of the component itself in React.memo but I think doing it in the export is cleaner.
