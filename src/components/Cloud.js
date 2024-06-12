import React, { memo } from 'react'

import config from '../_config'
const { canvasHeight } = config.constants

const Cloud = props => {

    if (canvasHeight === 0) { //This prevents the unnecessary render caused by App.js not yet having its state set in componentDidMount when the first render happens. I'm still getting one extra render for Cloud.js but it's not coming from the componentDidMount in App.js
        return
    }

    const cloudClassNameStrings = ['fa fa-cloud', 'icon ion-ios-cloud', 'icon ion-md-cloud', 'icon ion-ios-cloudy'] //A range of four different cloud icons spanning two svg libraries

    //Important to note that the below variables had to be calculated here, locally in this view component, because had they been calculated in App.js and passed as props it would've triggered a rerender with each setState in App.js which would've, in turn, triggered another call to the loop over the cloud array which, in turn, would've triggered another rerender... i.e. an infinite loop that was crashing the app as well as causing the clouds to disappear, reappear in random places with each rerender. So the dimVeil method of App.js is passed from App.js to Cloud.js which, in turn, calls it after travelDuration and size have been established.
    //Also, filter: `drop-shadow...` had to be added to the style property because Font Awesome comprises svg files, not fonts, so textShadow (and of course boxShadow) wouldn't work. Note, a drop shadow is effectively a blurred, offset version of the input image's alpha mask, drawn in a specific color and composited below the image, so not much wiggle room to do anything too creative with it.

    let cloudClassNameStringIndex = Math.floor(Math.random() * 4)
    let color = Math.floor(Math.random() * 360)
    let size = canvasHeight / (3 + Math.random() * 3)
    let opacity = .3 + Math.random() * .6
    let cloudHaze = size / 4
    let zIndex = Math.random() * -900
    let travelDuration = 24 + Math.random() * 24 //Ideally, travelDuration would be a function of canvas width (inversely proportional to it), which is already a function of canvas height. "18000 / canvasHeight + Math.random() * canvasHeight / 18000" works perfectly but takes too long for clouds to enter the screen on small devices.
    let animationNumber = Math.ceil(Math.random() * 32)

    props.dimVeil(travelDuration, size) //Call dimVeil in App.js and pass it the travelDuration, so it knows how to set the setTimeout to change the opacity of the veil accordingly, and the size so it knows how to set the setTimeout to change the opacity again for when the cloud has finished passing

    return(

        <div
            className='clouds'
            id='cloud'
            onAnimationEnd={() => {props.removeCloud(); console.log('animation end')}}
            style={{
                top: '50%'
                }}>

            <i
                className={cloudClassNameStrings[cloudClassNameStringIndex]}
                style={{
                    fontSize: `${size}px`,
                    color: `hsla(${color}, 100%, 96%, ${opacity})`,
                    filter: !props.cloudHazeOn ? null : `drop-shadow(0px 0px ${cloudHaze}px hsla(${color}, 100%, 96%, 1)`,
                    position: 'absolute',
                    zIndex: `${zIndex}`,
                    animation: `motionSizeAndFlip${animationNumber} ${travelDuration}s linear forwards`
                    }}>
            </i>

        </div>
    )
}

export default memo(Cloud) //I was getting unnecessary renders here so I'm wrapping the export of the component in memo, which does a shallow comparison for function components as React.PureComponent, or the older lifecycle method componentShouldUpdate(), do shallow comparisons to limit unnecessary re-rendering in class components. One could also simply wrap the code block of the component itself in React.memo but I think doing it in the export is cleaner.
