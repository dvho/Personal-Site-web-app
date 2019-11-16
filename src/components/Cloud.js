import React from 'react'

class Cloud extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    //Important to note that the below variables had to be calculated here, locally in this view component, because had they been calculated in App.js and passed as props it would've triggered a rerender with each setState in App.js which would've, in turn, triggered another call to the loop over the cloud array which, in turn, would've triggered another rerender... i.e. an infinite loop that was crashing the app as well as causing the clouds to disappear, reappear in random places with each rerender. So the dimVeil method of App.js is passed from App.js to Cloud.js which, in turn, calls it after travelDuration and size have been established.
    //Also, filter: `drop-shadow...` had to be added to the style property because Font Awesome comprises svg files, not fonts, so textShadow (and of course boxShadow) wouldn't work. Note, a drop shadow is effectively a blurred, offset version of the input image's alpha mask, drawn in a specific color and composited below the image, so not much wiggle room to do anything too creative with it.

    render() {

        let color = Math.floor(Math.random() * 360)
        let size = this.props.canvasHeight / (2 + Math.random() * 4)
        let opacity = .2 + Math.random() * .5
        let cloudHaze = Math.round(this.props.canvasHeight / 16)
        let zIndex = Math.random() * 9000
        let travelDuration = 32 + Math.random() * 32 //Ideally, travelDuration would be a function of canvas width (inversely proportional to it), which is already a function of canvas height
        let animationNumber = Math.ceil(Math.random() * 32)

        this.props.dimVeil(travelDuration, size)

        return(

            <div
                className='clouds'
                id='cloud'
                style={{
                    top: '50%',
                    }}>

                <i
                    className='fa fa-cloud'
                    style={{
                        fontSize: `${size}px`,
                        color: `hsla(${color}, 100%, 94%, ${opacity})`,
                        filter: `drop-shadow(0px 0px ${cloudHaze}px hsla(${color}, 100%, 96%, 1)`,
                        position: 'absolute',
                        zIndex: `${zIndex}`,
                        animation: `motionSizeAndFlip${animationNumber} ${travelDuration}s linear forwards`
                        }}>
                </i>

            </div>
        )
    }
}

export default Cloud
