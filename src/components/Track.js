import React from 'react'
import { useNavigate } from 'react-router-dom'

const Track = props => {

    const navigate = useNavigate()

    if (props.screenWidth === 0) { //In Track.js I'm not getting the unnecesary render caused by Home.js not yet having its state set in componentDidMount when the first render happens, but including this for good measure
        return
    }

    let isSelected = props.track.slug === props.currentTrack.slug

    let trackTitle = props.track.title

    let aspectRatio = 1808 / 1366 //Aspect ratio of the canvas (derived from main.png)
    let fontSizeDenom = 40 //Set denominator of fontSize here
    let fontSizeCalc = props.wideScreen ? props.canvasHeight / fontSizeDenom * aspectRatio : props.screenWidth / fontSizeDenom //Calculate fontSize as a function of either canvasHeight or screenWidth. Factoring in aspectRatio in the first ternary condition smooths the breakpoint between the two conditions.
    let leftOrRightPosition = props.wideScreen ? props.margin : 0 //Factor in the margin that falls outside the canvas for positioning each the left and right columns, respectively
    let textMargin = props.canvasHeight / 40 //Margin around each title as a function of canvasHeight
    let color = isSelected ? 'rgba(255,0,0,.85)' : null

    let onClick = e => {
        e.preventDefault()
        props.selectTrack(props.track)
    }

    let t
    let onHold = e => {
        //Because the default is onClick you don't want to e.preventDefault here
        if (e.type === 'mousedown' || e.type === 'touchstart') {
            t = setTimeout(() => {
                let slug = props.track.slug
                navigate(slug)
                window.location.reload() //If you don't call this here the path will change in your browser's address bar but the app won't navigate, and it must be called from a setTimeout otherwise the navigation will not have completed first
            }, 1000)
        }
        if (e.type === 'mouseup' || e.type === 'touchend') {
            clearTimeout(t)
        }
    }

    return(
        props.leftColumn ?

        <div style={{position: 'relative', left: leftOrRightPosition}} onClick={e => onClick(e)} onMouseDown={e => onHold(e)} onMouseUp={e => onHold(e)} onTouchStart={e => onHold(e)} onTouchEnd={e => onHold(e)}>
            <h1 style={{color: color, transform: isSelected ? 'scale(1.2)' : null, margin: textMargin, fontSize: fontSizeCalc}} className='title'>{props.trackNumber}. {trackTitle}</h1>
        </div>

        :

        <div style={{position: 'relative', right: leftOrRightPosition}} onClick={e => onClick(e)} onMouseDown={e => onHold(e)} onMouseUp={e => onHold(e)} onTouchStart={e => onHold(e)} onTouchEnd={e => onHold(e)}>
            <h1 style={{color: color, transform: isSelected ? 'scale(1.2)' : null, margin: textMargin, fontSize: fontSizeCalc}} className='title'>{props.trackNumber}. {trackTitle}</h1>
        </div>
    )
}

export default React.memo(Track) //In Track.js I'm not getting any unnecesary re-renders, but for good measure, I'm wrapping the export of the component in React.memo anyway
