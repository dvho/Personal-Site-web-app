import React from 'react'

const Track = props => {

    if (props.screenWidth === 0) { //In Track.js I'm not getting the unnecesary render caused by App.js not yet having its state set in componentDidMount when the first render happens, but including this for good measure
        return
    }

    let isSelected = props.track[0] === props.currentTrack[0]

    let trackTitle = props.track[0] //props.track is an array where the first element is the track title and the second is the url

    let aspectRatio = 1808 / 1366 //Aspect ratio of the canvas (derived from main.png)
    let fontSizeDenom = 40 //Set denominator of fontSize here
    let fontSizeCalc = props.wideScreen ? props.canvasHeight / fontSizeDenom * aspectRatio : props.screenWidth / fontSizeDenom //Calculate fontSize as a function of either canvasHeight or screenWidth. Factoring in aspectRatio in the first ternary condition smooths the breakpoint between the two conditions.
    let leftOrRightPosition = props.wideScreen ? props.margin : 0 //Factor in the margin that falls outside the canvas for positioning each the left and right columns, respectively
    let textMargin = props.canvasHeight / 40 //Margin around each title as a function of canvasHeight
    let color = isSelected ? 'rgba(255,0,0,.85)' : null

    return(
        props.leftColumn ?

        <div style={{position: 'relative', left: leftOrRightPosition}} onClick={() => props.selectTrack(props.track)}>
            <h1 style={{color: color, transform: isSelected ? 'scale(1.2)' : null, margin: textMargin, fontSize: fontSizeCalc}} className='title'>{props.trackNumber}. {trackTitle}</h1>
        </div>

        :

        <div style={{position: 'relative', right: leftOrRightPosition}} onClick={() => props.selectTrack(props.track)}>
            <h1 style={{color: color, transform: isSelected ? 'scale(1.2)' : null, margin: textMargin, fontSize: fontSizeCalc}} className='title'>{props.trackNumber}. {trackTitle}</h1>
        </div>
    )
}

export default React.memo(Track) //In Track.js I'm not getting any unnecesary re-renders, but for good measure, I'm wrapping the export of the component in React.memo anyway.
