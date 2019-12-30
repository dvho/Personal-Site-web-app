import React from 'react'
import '../App.css'

class SocialMenuLabels extends React.PureComponent {
    constructor() {
        super()
        this.state = {

        }
    }

    render() {

        let color = this.props.screenWidth > this.props.canvasWidth * .55 ? 'rgb(255,255,255)' : `rgb(1,1,40)` //Change the color if the screen is so narrow that the otherwise white text is overlapping the moon
        let narrowScreenRgbaOpacity = this.props.screenWidth > this.props.canvasWidth * .55 ? 0 : (this.props.veilOpacity - .3) * .5 //If the screen is so narrow that the text is overlapping the moon make the alpha channel of the rgba background no longer 0 but something commensurate with this.props.veilOpacity
        let left = this.props.canvasWidth < this.props.screenWidth ? this.props.margin + 60 : 60 //Make the parent div exactly 60px (which is the width of the social-menu-container) to the right of the left border of the canvas, or if the canvas is wider than the screen, 60px to the right of the left border of the screen.
        let containerClassName = this.props.menuOpen ? 'social-menu-labels-container social-menu-labels-container-visible' : 'social-menu-labels-container social-menu-labels-container-invisible'

        return(
            <div className={containerClassName} style={{left: left, color: color}}>
                <div class='social-menu-label-block-mail'>
                    <i class='fa fa-long-arrow-left arrow mail-arrow'></i>
                    <p class='social-text mail-social-text' style={{transition: 'background-color 1.5s linear', backgroundColor: `rgb(255,255,255,${narrowScreenRgbaOpacity})`}}>&nbsp;Mail&nbsp;</p>
                </div>
                <div class='social-menu-label-block-resume'>
                    <i class='fa fa-long-arrow-left arrow resume-arrow'></i>
                    <p class='social-text resume-social-text' style={{transition: 'background-color 1.5s linear', backgroundColor: `rgb(255,255,255,${narrowScreenRgbaOpacity})`}}>&nbsp;Resume&nbsp;</p>
                </div>
                <div class='social-menu-label-block-projects'>
                    <i class='fa fa-long-arrow-left arrow github-arrow'></i>
                    <i class='fa fa-long-arrow-left arrow npm-arrow'></i>
                    <p class='social-text projects-social-text' style={{transition: 'background-color 1.5s linear', backgroundColor: `rgb(255,255,255,${narrowScreenRgbaOpacity})`}}>&nbsp;Projects&nbsp;</p>
                </div>
            </div>
        )
    }
}

export default SocialMenuLabels
