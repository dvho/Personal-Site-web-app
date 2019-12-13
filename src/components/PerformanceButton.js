import React from 'react'
import '../App.css'
import config from '../config'

class PerformanceButton extends React.PureComponent {
    constructor() {
        super()
        this.state = {

        }
    }

    render() {

        let containerDiameter = this.props.state.performanceButtonDiameter * 2
        let buttonDiameter = this.props.state.performanceButtonDiameter
        let backgroundColor = this.props.state.performanceBoost ? 'rgb(128,128,0)' : 'rgb(255,255,255)'

        return(
            <div className="performanceButtonContainer" style={{width: containerDiameter, height: containerDiameter}} onClick={() => this.props.togglePerformanceBoost()}>
                <div className="performanceButton" style={{backgroundColor: backgroundColor, width: buttonDiameter, height: buttonDiameter, margin: this.props.state.performanceButtonDiameter /2}}></div>
            </div>
        )
    }
}

export default PerformanceButton
