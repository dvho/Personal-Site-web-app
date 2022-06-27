import React, { useState, useEffect } from 'react'

import { handControllerUtils } from './handControllerUtils'

const SocialMenu = props => {

    //It would have been ideal to have been able to control the hover vs non hover color of all the toggleable icons right from App.css like for the other icons in SocialMenu but in needing to overwright color from the inline style prop for those icons that ability was relinquished. The solution was to capture onMouseEnter and onMouseLeave for those elements and update state locally in SocialMenu itself. I tried to maintain these states as an object under a single isHoveringOverToggleableIcon hook but response to onMouseLeave and onMouseEnter were incredibly janky and unpredictable.
    const [isHoveringOverCloudHazeIcon, setIsHoveringOverCloudHazeIcon] = useState(false)
    const [isHoveringOverCloudIcon, setIsHoveringOverCloudIcon] = useState(false)
    const [isHoveringOverHandControllerIcon, setIsHoveringOverHandControllerIcon] = useState(false)

    let pullTabRef, contactFormRef, infoSheetRef, cloudsOnRef, cloudHazeOnRef, pullTabClasses, socialIconsColumn1Classes, socialIconsColumn2Classes, socialMenuContainerClasses
    let left = props.wideScreen ? props.margin : 0

    if (props.menuPosition === 1) {
        pullTabClasses = 'fa fa-angle-double-right pull-chevron-column pull-chevron-column-open'
        socialIconsColumn1Classes = 'social-icons-column social-icons-column-open'
        socialIconsColumn2Classes = 'social-icons-column social-icons-column-open-left-gradient'
        socialMenuContainerClasses = 'social-menu-container-open'
    }
    if (props.menuPosition === 2) {
        pullTabClasses = 'fa fa-angle-double-left pull-chevron-column pull-chevron-column-open'
        socialIconsColumn1Classes = 'social-icons-column social-icons-column-open'
        socialIconsColumn2Classes = 'social-icons-column social-icons-column-open social-icons-column-open-left-gradient'
        socialMenuContainerClasses = 'social-menu-container-open social-menu-container-open-wide'
    }
    if (props.menuPosition === 3) {
        pullTabClasses = 'fa fa-angle-double-left pull-chevron-column pull-chevron-column-open'
        socialIconsColumn1Classes = 'social-icons-column social-icons-column-open'
        socialIconsColumn2Classes = 'social-icons-column social-icons-column-open-left-gradient'
        socialMenuContainerClasses = 'social-menu-container-open'
    }
    if (props.menuPosition === 0) {
        pullTabClasses = 'fa fa-angle-double-right pull-chevron-column'
        socialIconsColumn1Classes = 'social-icons-column'
        socialIconsColumn2Classes = 'social-icons-column social-icons-column-open-left-gradient'
        socialMenuContainerClasses = 'social-menu-container-open'
    }

    useEffect(() => {
        handControllerUtils.handleHand(props, pullTabRef, props.toggleMenuPosition, 500)
        handControllerUtils.handleHand(props, contactFormRef, props.toggleContactForm, 500)
        handControllerUtils.handleHand(props, infoSheetRef, props.toggleInfoSheet, 500)
        handControllerUtils.handleHand(props, cloudsOnRef, props.toggleCloudsOn, 1000)
        handControllerUtils.handleHand(props, cloudHazeOnRef, props.toggleCloudHazeOn, 1000)
        //No, you can't use the HandController to turn itself off and not be able to turn it back on again. Would've been okay but getting error "HandController.js:51 Uncaught (in promise) TypeError: Cannot read properties of null (reading 'video'), at Object.onFrame (HandController.js:51:1), at Q (camera_utils.js:22:1), at camera_utils.js:22:1" when turning it off and when turning it back on via mouse or touch a 'ghost' hand appears playing where your hand was when handControllerOn was false
    }, [props, pullTabRef, contactFormRef, infoSheetRef, cloudsOnRef, cloudHazeOnRef])

    return(
        <div className={socialMenuContainerClasses} style={{left: left}}>

            <div className={socialIconsColumn2Classes}>
                <i className='cloud icon social-icon fa-solid fa-cloud' onMouseEnter={() => setIsHoveringOverCloudIcon(true)} onMouseLeave={() => setIsHoveringOverCloudIcon(false)} style={{color: isHoveringOverCloudIcon ? 'rgba(0,170,170,.95)' : (props.cloudsOn ? 'rgb(192,128,255)' : 'rgb(255,255,255)')}} onClick={() => props.toggleCloudsOn()} ref={ref => cloudsOnRef = ref} />
                <i className='cloud-haze fi fi-cloudy-gusts' onMouseEnter={() => setIsHoveringOverCloudHazeIcon(true)} onMouseLeave={() => setIsHoveringOverCloudHazeIcon(false)} style={{color: isHoveringOverCloudHazeIcon ? 'rgba(0,170,170,.95)' : (props.cloudHazeOn ? 'rgb(80,80,255)' : 'rgb(255,255,255)')}} onClick={() => props.toggleCloudHazeOn()} ref={ref => cloudHazeOnRef = ref} />
                <i className='hand icon social-icon fa-solid fa-hand-sparkles' onMouseEnter={() => setIsHoveringOverHandControllerIcon(true)} onMouseLeave={() => setIsHoveringOverHandControllerIcon(false)} style={{color: isHoveringOverHandControllerIcon ? 'rgba(0,170,170,.95)' : (props.handControllerOn ? 'rgb(255,0,0)' : 'rgb(255,255,255)')}} onClick={() => props.toggleHandControllerOn()} />
            </div>

            <div className={socialIconsColumn1Classes}>
                <i className='icon ion-md-mail mail social-icon' onClick={() => props.toggleContactForm()} ref={ref => contactFormRef = ref}/>
                <a className='linkedin social-icon' href='https://www.linkedin.com/in/dvho' target='_blank' rel='noopener noreferrer'><i className='icon ion-logo-linkedin'/></a>
                <a className='resume social-icon' href='https://dvho.github.io/resume' target='_blank' rel='noopener noreferrer'><i className='icon ion-md-paper'/></a>
                <a className='github social-icon' href='https://github.com/dvho' target='_blank' rel='noopener noreferrer'><i className='icon ion-logo-github'/></a>
                <a className='npm social-icon' href='https://www.npmjs.com/~dvho' target='_blank' rel='noopener noreferrer'><i className='icon ion-logo-npm'/></a>
                <i className='fa fa-info-circle info social-icon' onClick={() => props.toggleInfoSheet()} ref={ref => infoSheetRef = ref}/>
            </div>

            <i className={pullTabClasses} onClick={() => props.toggleMenuPosition()}>
                <div className='pull-chevron-column-hand-controller-specific' ref={ref => pullTabRef = ref}/> { /* This invisible div of class pull-chevron-column-hand-controller-specific is inserted only so that it can carry the ref of the pull tab for the sake of the hand controller. Without it, i.e. with    ref={ref => pullTabRef = ref}    in the    i className={pullTabClasses}    , the hand controller would fire across the entire height of the SocialMenu as it does for onClick */ }
            </i>

        </div>
    )
}

export default React.memo(SocialMenu) //I was getting unnecesary renders here so I'm wrapping the export of the component in React.memo, which does a shallow comparison for function components as React.PureComponent, or the older lifecycle method componentShouldUpdate(), do shallow comparisons to limit unnecessary re-rendering in class components. One could also simply wrap the code block of the component itself in React.memo but I think doing it in the export is cleaner.
