import React from 'react'
import '../App.css'
import config from '../config'

class Cloud extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            opacity: .7
        }
    }

    render() {
        return(

            <img
                alt={'veil'}
                src={config.images.veil}
                className='canvas'
                style={{
                    opacity: `${this.props.opacity.toString()}`,
                    transition: 'opacity 2s ease'
                    }}/>
        )
    }
}

export default Cloud
