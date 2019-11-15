import React from 'react'
import '../App.css'
import config from '../config'

class Cloud extends React.Component {
    constructor() {
        super()
        this.state = {
            opacity: .8
        }
    }

    render() {
        return(

            <img
                alt={'veil'}
                src={config.images.veil}
                className='canvas'
                style={{
                    opacity: `${this.state.opacity.toString()}`
                    }}/>
        )
    }
}

export default Cloud
