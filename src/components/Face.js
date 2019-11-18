import React from 'react'
import '../App.css'
import config from '../config'

//Float point conversion was giving values like '8.9999999999999' hence the verbose localOpacity = `${((Math.round(this.props.opacity * 10))/10).toString()}`

class Face extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        let localOpacity
        if (this.props.opacity > .25) {
            localOpacity = '.25'
        } else {
            localOpacity = `${((Math.round(this.props.opacity * 10))/10).toString()}`
        }

        return(

            <img
                alt={'face'}
                src={config.images.faceTest}
                className='canvas'
                style={{
                    opacity: localOpacity,
                    transition: 'opacity 2s linear'
                    }}/>
        )
    }
}

export default Face
