import React from 'react'
import '../App.css'

class PerformanceButton extends React.PureComponent {
    constructor() {
        super()
        this.state = {

        }
    }

    render() {

        let containerDiameter = this.props.performanceButtonDiameter * 2
        let buttonDiameter = this.props.performanceButtonDiameter
        let margin = this.props.performanceButtonDiameter * .5
        let backgroundColor = this.props.performanceBoost ? 'rgb(128,128,0)' : 'rgb(255,255,255)'

        return(
            <div className="performanceButtonContainer" style={{width: containerDiameter, height: containerDiameter}} onClick={() => this.props.togglePerformanceBoost()}>
                <div style={{backgroundColor: backgroundColor, width: buttonDiameter, height: buttonDiameter, margin: margin}} className="performanceButton"></div>
            </div>
        )
    }
}

export default PerformanceButton
