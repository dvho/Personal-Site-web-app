import React from 'react'

const PerformanceButton = props => {

    if (props.performanceButtonDiameter === 0) { //This prevents the unnecesary render caused by App.js not yet having its state set in componentDidMount when the first render happens
        return
    }

    let containerDiameter = props.performanceButtonDiameter * 2
    let buttonDiameter = props.performanceButtonDiameter
    let margin = props.performanceButtonDiameter * .5
    let backgroundColor = props.performanceBoost ? null : 'rgb(255,255,255)'

    return(
        <div className='performance-button-container' style={{width: containerDiameter, height: containerDiameter}} onClick={() => props.togglePerformanceBoost()}>
            <div style={{backgroundColor: backgroundColor, width: buttonDiameter, height: buttonDiameter, margin: margin}} className='performance-button'></div>
        </div>
    )
}

export default React.memo(PerformanceButton) //I was getting unnecesary renders here so I'm wrapping the export of the component in React.memo, which does a shallow comparison for function components as React.PureComponent, or the older lifecycle method componentShouldUpdate(), do shallow comparisons to limit unnecessary re-rendering in class components. One could also simply wrap the code block of the component itself in React.memo but I think doing it in the export is cleaner.
