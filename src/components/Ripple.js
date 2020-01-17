import React from 'react'

const Ripple = props => {

    let diameter = props.canvasHeight / 10
    let blur = props.canvasHeight / 35
    let spread = props.canvasHeight / 20
    let left = props.screenWidth < props.canvasWidth ? props.screenWidth * props.rippleXCoord - diameter / 2 : props.margin - diameter / 2 + props.canvasWidth * props.rippleXCoord
    let top = props.canvasHeight * props.rippleYCoord - diameter / 2
    let boxShadow = `0 0 ${blur}px ${spread}px #fff, inset 0 0 ${blur}px ${spread}px #fff`

    return(
        <div className='ripple' style={{width: diameter, height: diameter, left: left, top: top, boxShadow: boxShadow}}></div>
    )
}

export default React.memo(Ripple) //I was getting unnecesary renders here so I'm wrapping the export of the component in React.memo, which does a shallow comparison for function components as React.PureComponent, or the older lifecycle method componentShouldUpdate(), do shallow comparisons to limit unnecessary re-rendering in class components. One could also simply wrap the code block of the component itself in React.memo but I think doing it in the export is cleaner.
