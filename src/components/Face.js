import React from 'react'
import config from '../config'

const Face = props => {

    if (props.screenWidth === 0) { //This prevents the unnecesary render caused by App.js not yet having its state set in componentDidMount when the first render happens. There's no other reason for me to pass screenWidth to Face.js from App.js other than to use it as an indicator for whether componentDidMount has run (and all state has been set) in App.js
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
                src={config.images.canvas.faceMain}
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

export default React.memo(Face) //I was getting unnecesary renders here so I'm wrapping the export of the component in React.memo, which does a shallow comparison for function components as React.PureComponent, or the older lifecycle method componentShouldUpdate(), do shallow comparisons to limit unnecessary re-rendering in class components. One could also simply wrap the code block of the component itself in React.memo but I think doing it in the export is cleaner.
