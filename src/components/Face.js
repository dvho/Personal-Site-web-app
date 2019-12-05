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
        if (this.props.opacity > .06) {
            localOpacity = '.06'
        } else {
            localOpacity = `${(this.props.opacity).toString()}`
        }

        localOpacity = 1

        return(
            <div
                style={{
                    opacity: localOpacity,
                    transition: 'opacity 2.5s linear'
                    }}>
                <img
                    alt={'face-main'}
                    src={config.images.faceMain}
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
