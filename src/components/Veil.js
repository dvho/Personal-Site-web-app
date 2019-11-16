import React from 'react'
import '../App.css'
import config from '../config'

class Cloud extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        //console.log(this.props.opacity)
        return(

            <img
                alt={'veil'}
                src={config.images.veil}
                className='canvas'
                style={{
                    opacity: `${this.props.opacity.toString()}`,
                    transition: 'opacity 1.5s ease'
                    }}/>
        )
    }
}

export default Cloud
