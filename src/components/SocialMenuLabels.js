import React from 'react'

import config from '../_config'

const { screenWidth, canvasWidth, wideScreen, margin } = config.constants

const SocialMenuLabels = props => {

    if (screenWidth === 0) { //This prevents the unnecessary render caused by App.js not yet having its state set in componentDidMount when the first render happens
        return
    }

    let containerClasses

    let specialWidth = screenWidth > canvasWidth * .55

    let color = specialWidth ? 'rgb(255,255,255)' : `rgb(${props.veilOpacity * 110},1,40)` //Change the color if the screen is so narrow that the otherwise white text is overlapping the moon. If the text does overlap the moon make the default color rgb(1,1,40) and increase the red according as a function of the veilOpacity so that the rgb(1,1,40) doesn't become camouflaged when the room darken to rgb(1,1,40)
    let narrowScreenRgbaOpacity = specialWidth ? 0 : (props.veilOpacity - .3) * .5 //If the screen is so narrow that the text is overlapping the moon make the alpha channel of the rgba background no longer 0 but something commensurate with props.veilOpacity
    let left = wideScreen ? margin + 60 : 60 //Make the parent div exactly 60px (which is the width of the social-menu-container) to the right of the left border of the canvas, or if the canvas is wider than the screen, 60px to the right of the left border of the screen.

    if (props.menuPosition === 1) {
        containerClasses = 'social-menu-labels-container social-menu-labels-container-visible'
    }
    if (props.menuPosition === 2) {
        containerClasses = 'social-menu-labels-container social-menu-labels-container-wide'
    }
    if (props.menuPosition === 3) {
        containerClasses = 'social-menu-labels-container social-menu-labels-container-visible'
    }
    if (props.menuPosition === 0) {
        containerClasses = 'social-menu-labels-container social-menu-labels-container-invisible'
    }


    return(
        <div className={containerClasses} style={{left: left, color: color}}>
            <div className='social-menu-label-block-mail'>
                <i className='fa fa-long-arrow-left arrow mail-arrow'/>
                <p className='social-text mail-social-text' style={{transition: 'background-color 1.5s linear', backgroundColor: `rgb(255,255,255,${narrowScreenRgbaOpacity})`}}>&nbsp;Email&nbsp;</p>
            </div>
            <div className='social-menu-label-block-resume'>
                <i className='fa fa-long-arrow-left arrow resume-arrow'/>
                <p className='social-text resume-social-text' style={{transition: 'background-color 1.5s linear', backgroundColor: `rgb(255,255,255,${narrowScreenRgbaOpacity})`}}>&nbsp;Resume&nbsp;</p>
            </div>
            <div className='social-menu-label-block-projects'>
                <i className='fa fa-long-arrow-left arrow github-arrow'/>
                <i className='fa fa-long-arrow-left arrow npm-arrow'/>
                <p className='social-text projects-social-text' style={{transition: 'background-color 1.5s linear', backgroundColor: `rgb(255,255,255,${narrowScreenRgbaOpacity})`}}>&nbsp;Projects&nbsp;</p>
            </div>
            <div className='social-menu-label-block-info'>
                <i className='fa fa-long-arrow-left arrow info-arrow'/>
                <p className='social-text info-social-text' style={{transition: 'background-color 1.5s linear', backgroundColor: `rgb(255,255,255,${narrowScreenRgbaOpacity})`}}>&nbsp;How&nbsp;did&nbsp;I&nbsp;build&nbsp;this&nbsp;?&nbsp;</p>
            </div>
        </div>
    )
}

export default SocialMenuLabels
