import React from 'react'

class InfoSheet extends React.PureComponent {
    constructor() {
        super()
        this.state = {

        }
    }

    render() {

        let left = this.props.state.canvasWidth < this.props.state.screenWidth ? this.props.state.margin + this.props.state.canvasWidth - 243 : this.props.state.screenWidth - 243
        let height = this.props.state.canvasHeight * .8
        let className = this.props.state.revealInfoSheet ? 'info-sheet-container info-sheet-container-revealed' : 'info-sheet-container'


        return(
            <div className={className} style={{left: left, height: height}}>
                <h className='info-sheet-heading'>How did I build this?</h>
                <p>I built this app with React (and ReactPlayer, for the audio component). There are no other dependencies! Play any of my songs (still works in progress) from the interface below or click their titles.</p>
                <p>When clouds outside pass in front of the moon they dim the moonlight entering the room and reveal my animated face, which you can interact with by mouse or touch. The visibility of my face is commensurate with the darkness of the room at any given moment. </p>
                <p>Click the contact menu on the left to send me an email, view my resume, or check out some of my other projects on GitHub and NPM. You can toggle the performance button at the top right to add haziness to the clouds, the default for which is off since this does strain your GPU.</p>
            </div>
        )
    }
}

export default InfoSheet
