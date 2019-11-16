import React from 'react'

class Cloud extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    //Important to note that the below variables had to be calculated here, locally in this view component, because had they been calculated in App.js and passed as props it would've triggered a rerender with each setState in App.js which would've, in turn, triggered another call to the loop over the cloud array which, in turn, would've triggered another rerender... i.e. an infinite loop that was crashing the app as well as causing the clouds to disappear, reappear in random places with each rerender. So the dimVeil method of App.js is passed from App.js to Cloud.js which, in turn, calls it after travelDuration and size have been established.
    
    render() {

        let color = Math.floor(Math.random() * 360)
        let size = this.props.canvasHeight / (2 + Math.random() * 4)
        let opacity = .1 + Math.random() * .6
        let zIndex = Math.random() * 9000
        let travelDuration = 32 + Math.random() * 32
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
                        color: `rgba(${color},${color},${color},${opacity})`,
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
