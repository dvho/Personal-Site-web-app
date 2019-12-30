import React from 'react'
import '../App.css'

class SocialMenuLabels extends React.PureComponent {
    constructor() {
        super()
        this.state = {

        }
    }

    render() {

        let left = this.props.canvasWidth < this.props.screenWidth ? this.props.margin + 60 : 60
        let containerClassName = this.props.menuOpen ? 'social-menu-labels-container social-menu-labels-container-visible' : 'social-menu-labels-container social-menu-labels-container-invisible'

        return(
            <div className={containerClassName} style={{left: left}}>
                <div class='social-menu-label-block-mail'>
                    <i class='fa fa-long-arrow-left arrow mail-arrow'></i>
                    <p class='social-text mail-social-text'>Mail</p>
                </div>
                <div class='social-menu-label-block-resume'>
                    <i class='fa fa-long-arrow-left arrow resume-arrow'></i>
                    <p class='social-text resume-social-text'>Resume</p>
                </div>
                <div class='social-menu-label-block-projects'>
                    <i class='fa fa-long-arrow-left arrow github-arrow'></i>
                    <i class='fa fa-long-arrow-left arrow npm-arrow'></i>
                    <p class='social-text projects-social-text'>Projects</p>
                </div>
            </div>
        )
    }
}

export default SocialMenuLabels
