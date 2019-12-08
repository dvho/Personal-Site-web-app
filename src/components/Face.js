import React from 'react'
import '../App.css'
import config from '../config'

class Face extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        let localOpacity
        if (this.props.opacity > .20) {
            localOpacity = '.20'
        } else {
            localOpacity = `${(this.props.opacity).toString()}`
        }

        return(
            <div
                style={{
                    opacity: localOpacity,
                    transition: 'opacity 2.5s linear'
                    }}>
                <img
                    alt={'face-main'}
                    src={config.images.canvas.faceMain}
                    className='canvas'
                    />
                <img
                    alt={'face-frame'}
                    src={this.props.faceFrame}
                    className='canvas'
                    />
            </div>
        )
    }
}

export default Face
