import React from 'react'

class Cloud extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

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
