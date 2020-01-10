import React from 'react'
import config from '../config'

class Face extends React.PureComponent {
    constructor() {
        super()
        this.state = {

        }
    }

    render() {
        let localOpacity = Math.round(this.props.opacity * 1000) / 1000 - .225
        if (localOpacity > .30) {
            localOpacity = '.30'
        } else {
            localOpacity = `${(localOpacity).toString()}`
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
