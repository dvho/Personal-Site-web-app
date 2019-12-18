import React from 'react'
import '../App.css'

class Track extends React.PureComponent {
    constructor() {
        super()
        this.state = {

        }
    }

    render() {

        let trackTitle = this.props.currentTrack[0]

        let aspectRatio = 1808 / 1366
        let fontSizeDenom = 34
        let leftOrRightPosition = this.props.screenWidth > this.props.canvasWidth ? this.props.margin : 0
        let fontSizeCalc = this.props.screenWidth > this.props.canvasWidth ? this.props.canvasHeight / fontSizeDenom * aspectRatio : this.props.screenWidth / fontSizeDenom
        let textMargin = this.props.canvasHeight / 50

        return(
            this.props.leftColumn ?

            <div style={{position: 'relative', left: leftOrRightPosition}} onClick={() => this.props.selectTrack(this.props.currentTrack)}>
                <h1 style={{color: 'white', margin: textMargin, fontSize: fontSizeCalc}}>{this.props.trackNumber}. {trackTitle}</h1>
            </div>

            :

            <div style={{position: 'relative', right: leftOrRightPosition}} onClick={() => this.props.selectTrack(this.props.currentTrack)}>
                <h1 style={{color: 'white', margin: textMargin, fontSize: fontSizeCalc}}>{this.props.trackNumber}. {trackTitle}</h1>
            </div>
        )
    }
}

//screenWidth
//canvasWidth
//canvasHeight
//margin


export default Track
