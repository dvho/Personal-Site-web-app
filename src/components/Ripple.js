import React from 'react'

class Ripple extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        let diameter = this.props.canvasHeight / 10
        let blur = this.props.canvasHeight / 35
        let spread = this.props.canvasHeight / 20
        let left = this.props.screenWidth < this.props.canvasWidth ? this.props.screenWidth * this.props.rippleXCoord - diameter / 2 : this.props.margin - diameter / 2 + this.props.canvasWidth * this.props.rippleXCoord
        let top = this.props.canvasHeight * this.props.rippleYCoord - diameter / 2
        let boxShadow = `0 0 ${blur}px ${spread}px #fff, inset 0 0 ${blur}px ${spread}px #fff`

        return(
            <div className='ripple' style={{width: diameter, height: diameter, left: left, top: top, boxShadow: boxShadow}}></div>
        )
    }
}

export default Ripple
