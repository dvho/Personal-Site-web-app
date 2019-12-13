import React from 'react'
import '../App.css'
import config from '../config'

class Ripple extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        let diameter = this.props.state.canvasHeight / 10
        let left = this.props.state.screenWidth < this.props.state.canvasWidth ? this.props.state.screenWidth * this.props.state.rippleXCoord - diameter / 2 : this.props.state.margin - diameter / 2 + this.props.state.canvasWidth * this.props.state.rippleXCoord
        let top = this.props.state.canvasHeight * this.props.state.rippleYCoord - diameter / 2
        let boxShadow = `0 0 ${diameter}px ${diameter}px #fff, inset 0 0 ${diameter}px ${diameter}px #fff`

        return(
            <div className="ripple" style={{width: diameter, height: diameter, left: left, top: top, boxShadow: boxShadow}}></div>
        )
    }
}

export default Ripple
