import React from 'react'
import '../App.css'
import config from '../config'

//Float point conversion was giving values like '8.9999999999999' hence the verbose localOpacity = `${((Math.round(this.props.opacity * 10))/10).toString()}`

class Cloud extends React.PureComponent {
    constructor() {
        super()
        this.state = {

        }
    }

    render() {
        let localOpacity
        if (this.props.opacity >= 1) {
            localOpacity = '.9'
        } else {
            localOpacity = `${((Math.round(this.props.opacity * 10))/10).toString()}`
        }

        return(

            <img
                alt={'veil'}
                src={config.images.canvas.veil}
                className='canvas'
                style={{
                    opacity: localOpacity,
                    transition: 'opacity 1.5s ease'
                    }}/>
        )
    }
}

export default Cloud
