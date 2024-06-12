import React from 'react'

import config from '../_config'

const { screenWidth, canvasHeight, canvasWidth, wideScreen, margin } = config.constants

const Ripple = props => {

    let diameter = canvasHeight / 10
    let blur = canvasHeight / 35
    let spread = canvasHeight / 20
    let left = wideScreen ? margin - diameter / 2 + canvasWidth * props.coords.xCoordStatic : screenWidth * props.coords.xCoordStatic - diameter / 2
    let top = canvasHeight * props.coords.yCoordStatic - diameter / 2
    let boxShadow = `0 0 ${blur}px ${spread}px #fff, inset 0 0 ${blur}px ${spread}px #fff`

    return(
        <div className='ripple' style={{width: diameter, height: diameter, left: left, top: top, boxShadow: boxShadow}}></div>
    )
}

export default Ripple
