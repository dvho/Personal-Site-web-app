import React from 'react'

class Cloud extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {

        return(

            <div
                className='clouds'
                style={{
                    top: '50%'
                    }}>

                <i
                    className='fa fa-cloud'
                    style={{
                        fontSize: '10px',
                        color: 'rgb(255,255,255)',
                        // *transform: 'rotateY(180deg) translateY(-50%) translateX(-100vw)', *//
                        animation: `motionAndSize1 ${this.props.travelDuration}s linear`
                        }}>
                </i>

            </div>
        )
    }
}

export default Cloud
