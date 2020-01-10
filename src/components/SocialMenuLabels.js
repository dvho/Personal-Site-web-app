import React from 'react'

class SocialMenuLabels extends React.PureComponent {
    constructor() {
        super()
        this.state = {

        }
    }

    render() {

        console.log(this.props.veilOpacity)

        let color = this.props.screenWidth > this.props.canvasWidth * .55 ? 'rgb(255,255,255)' : `rgb(${1 + this.props.veilOpacity * 110},1,40)` //Change the color if the screen is so narrow that the otherwise white text is overlapping the moon. If the text does overlap the moon make the default color rgb(1,1,40) and increase the red according as a function of the veilOpacity so that the rgb(1,1,40) doesn't become camouflaged when the room darken to rgb(1,1,40)
        let narrowScreenRgbaOpacity = this.props.screenWidth > this.props.canvasWidth * .55 ? 0 : (this.props.veilOpacity - .3) * .5 //If the screen is so narrow that the text is overlapping the moon make the alpha channel of the rgba background no longer 0 but something commensurate with this.props.veilOpacity
        let left = this.props.canvasWidth < this.props.screenWidth ? this.props.margin + 60 : 60 //Make the parent div exactly 60px (which is the width of the social-menu-container) to the right of the left border of the canvas, or if the canvas is wider than the screen, 60px to the right of the left border of the screen.
        let containerClassName = this.props.menuOpen ? 'social-menu-labels-container social-menu-labels-container-visible' : 'social-menu-labels-container social-menu-labels-container-invisible'

        return(
            <div className={containerClassName} style={{left: left, color: color}}>
                <div className='social-menu-label-block-mail'>
                    <i className='fa fa-long-arrow-left arrow mail-arrow'></i>
                    <p className='social-text mail-social-text' style={{transition: 'background-color 1.5s linear', backgroundColor: `rgb(255,255,255,${narrowScreenRgbaOpacity})`}}>&nbsp;Email&nbsp;</p>
                </div>
                <div className='social-menu-label-block-resume'>
                    <i className='fa fa-long-arrow-left arrow resume-arrow'></i>
                    <p className='social-text resume-social-text' style={{transition: 'background-color 1.5s linear', backgroundColor: `rgb(255,255,255,${narrowScreenRgbaOpacity})`}}>&nbsp;Resume&nbsp;</p>
                </div>
                <div className='social-menu-label-block-projects'>
                    <i className='fa fa-long-arrow-left arrow github-arrow'></i>
                    <i className='fa fa-long-arrow-left arrow npm-arrow'></i>
                    <p className='social-text projects-social-text' style={{transition: 'background-color 1.5s linear', backgroundColor: `rgb(255,255,255,${narrowScreenRgbaOpacity})`}}>&nbsp;Projects&nbsp;</p>
                </div>
                <div className='social-menu-label-block-info'>
                    <i className='fa fa-long-arrow-left arrow info-arrow'></i>
                    <p className='social-text info-social-text' style={{transition: 'background-color 1.5s linear', backgroundColor: `rgb(255,255,255,${narrowScreenRgbaOpacity})`}}>&nbsp;How'd&nbsp;you&nbsp;build&nbsp;this&nbsp;?&nbsp;</p>
                </div>
            </div>
        )
    }
}

export default SocialMenuLabels
