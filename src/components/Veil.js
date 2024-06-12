import React from 'react'
import config from '../_config'

//Float point conversion was giving values like '8.9999999999999' hence the verbose localOpacity = `${((Math.round(props.opacity * 10))/10).toString()}`

const Veil = props => {

    if (props.screenWidth === 0) { //After using React.PureComponent, or React.memo now that this is a function component, I wasn't getting the unnecesary render caused by App.js not yet having its state set in componentDidMount when the first render happens, but including this for good measure
        return
    }

    let localOpacity
    if (props.opacity >= 1) {
        localOpacity = '.9'
    } else {
        localOpacity = `${((Math.round(props.opacity * 10))/10).toString()}`
    }

    return(

        <img
            alt={'veil'}
            src={config.images.canvas.veil}
            className='canvas'
            style={{
                opacity: localOpacity,
                transition: 'opacity 1.5s linear'
                }}/>
    )
}

export default Veil
