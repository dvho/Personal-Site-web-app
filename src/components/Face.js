import React from 'react'

import config from '../_config'

const { screenWidth } = config.constants
const { faceMain } = config.images.canvas

const Face = props => {

    if (screenWidth === 0) { //This prevents the unnecesary render caused by App.js not yet having its state set in componentDidMount when the first render happens. There's no other reason for me to pass screenWidth to Face.js from App.js other than to use it as an indicator for whether componentDidMount has run (and all state has been set) in App.js
        return
    }

    let localOpacity = Math.round(props.opacity * 1000) / 1000 - .225
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
                src={faceMain}
                className='canvas'
                />
            <img
                alt={'face-frame'}
                src={props.faceFrame}
                className='canvas'
                />
        </div>
    )
}

export default Face
