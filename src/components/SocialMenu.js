import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import config from '../_config'
import utils from '../_utils'

const { wideScreen, margin } = config.constants

const SocialMenu = props => {

    const navigate = useNavigate()

    let pullTabRef, contactFormRef, infoSheetRef, cloudsOnRef, cloudHazeOnRef, pullTabClasses, socialIconsColumn1Classes, socialIconsColumn2Classes, socialMenuContainerClasses
    let left = wideScreen ? margin : 0

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
        if (props.isHandPointing) {
            utils.handleHand(props.coords, pullTabRef, () => props.dispatch({type: 'toggleMenuPosition'}), 250)
            utils.handleHand(props.coords, contactFormRef, () => props.dispatch({type: 'toggleContactForm'}), 250)
            utils.handleHand(props.coords, infoSheetRef, () => props.dispatch({type: 'toggleInfoSheet'}), 250)
            utils.handleHand(props.coords, cloudsOnRef, () => props.dispatch({type: 'toggleClouds'}), 250)
            utils.handleHand(props.coords, cloudHazeOnRef, () => props.dispatch({type: 'toggleCloudHaze'}), 250)
        }
        //I would have had something like    utils.handleHand(props.coords, handControllerRef, () => props.dispatch({type: 'toggleHandController'}), <rate>)    so that HandController could turn itself off (and obviously not be able to turn itself back on again). That would've been okay but was getting the error "HandController.js:51 Uncaught (in promise) TypeError: Cannot read properties of null (reading 'video'), at Object.onFrame (HandController.js:51:1), at Q (camera_utils.js:22:1), at camera_utils.js:22:1" when turning it off, and when turning it back on via mouse or touch a 'ghost' hand would appear where one's hand was even though handControllerOn was false
    }, [props, pullTabRef, contactFormRef, infoSheetRef, cloudsOnRef, cloudHazeOnRef])

    return(
        <div className={socialMenuContainerClasses} style={{left: left}}>

            <div className={socialIconsColumn2Classes}>
                <i className='plane social-icon fa fa-plane-departure' onClick={() => { navigate('journeys'); window.location.reload()}}/> {/* If you don't call window.location.reload here too the path will change in your browser's address bar but the app won't navigate */}
                <i className='cloud social-icon fa-solid fa-cloud' style={{color: props.cloudsOn ? 'rgb(192,128,255)' : 'rgb(255,255,255)'}} onClick={() => props.dispatch({type: 'toggleClouds'})} ref={ref => cloudsOnRef = ref} />
                <i className='cloud-haze fi fi-cloudy-gusts' style={{color: props.cloudHazeOn ? 'rgb(80,80,255)' : 'rgb(255,255,255)'}} onClick={() => props.dispatch({type: 'toggleCloudHaze'})} ref={ref => cloudHazeOnRef = ref} />
                <i className='hand social-icon fa-solid fa-hand-sparkles' style={{color: props.handControllerOn ? 'rgb(255,0,0)' : 'rgb(255,255,255)'}} onClick={() => props.dispatch({type: 'toggleHandController'})} />
            </div>

            <div className={socialIconsColumn1Classes}>
                <i className='icon ion-md-mail mail social-icon' onClick={() => props.dispatch({type: 'toggleContactForm'})} ref={ref => contactFormRef = ref}/>
                <a className='linkedin social-icon' href='https://www.linkedin.com/in/dvho' target='_blank' rel='noopener noreferrer'><i className='icon ion-logo-linkedin'/></a>
                <a className='resume social-icon' href='https://dvho.github.io/resume' target='_blank' rel='noopener noreferrer'><i className='icon ion-md-paper'/></a>
                <a className='github social-icon' href='https://github.com/dvho' target='_blank' rel='noopener noreferrer'><i className='icon ion-logo-github'/></a>
                <a className='npm social-icon' href='https://www.npmjs.com/~dvho' target='_blank' rel='noopener noreferrer'><i className='icon ion-logo-npm'/></a>
                <i className='fa fa-info-circle info social-icon' onClick={() => props.dispatch({type: 'toggleInfoSheet'})} ref={ref => infoSheetRef = ref}/>
            </div>

            <i className={pullTabClasses} onClick={() => props.dispatch({type: 'toggleMenuPosition'})}>
                <div className='pull-chevron-column-hand-controller-specific' ref={ref => pullTabRef = ref}/> { /* This invisible div of class pull-chevron-column-hand-controller-specific is inserted only so that it can carry the ref of the pull tab for the sake of the hand controller. Without it, i.e. with    ref={ref => pullTabRef = ref}    in the    i className={pullTabClasses}    , the hand controller would fire across the entire height of the SocialMenu as it does for onClick */ }
            </i>

        </div>
    )
}

export default SocialMenu
