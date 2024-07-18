import React, { useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import utils from '../_utils'

const { getStylesAndClassNamesForSocialMenu, handleHand } = utils


const SocialMenu = ({ dispatch, coords, isHandPointing, menuPosition, cloudsOn, cloudHazeOn, handControllerOn }) => {

    //I'm using useRef instead of the callback ref pattern    ref={ref => <refName> = ref}    for performance purposes. Refs with useRef return a mutable ref object whose .current property is initialized to the argument passed to it, in this case, null. The returned object will persist for the full lifetime of the component providing a consistent way to access the refs. The callback ref pattern on the other hand will be called more than once during updates, as it gets called first with null and then again with the DOM element each time the component rerenders. useRef however doesn't cause a rerender when the ref object is mutated, which is beneficial for performance when you need to frequently update the ref without needing to update the component visually. The callback ref pattern might lead to performance hits if not managed carefully especially if the ref callback triggers rerenders or is tied to high-frequency events
    const pullTabRef = useRef(null)
    const contactFormRef = useRef(null)
    const infoSheetRef = useRef(null)
    const cloudsOnRef = useRef(null)
    const cloudHazeOnRef = useRef(null)

    const navigate = useNavigate()

    const { styles, classNames } = useMemo(() => getStylesAndClassNamesForSocialMenu(menuPosition, cloudsOn, cloudHazeOn, handControllerOn), [menuPosition, cloudsOn, cloudHazeOn, handControllerOn]) //Memoize calls to utils.getStylesAndClassNamesForSocialMenu to prevent the otherwise rapid unnecessary rerenders that would come from the coords changing in Home.js. Note, the coords prop is not even passed to SocialMenu but, unlike other components' visibilities handled by booleans from within the markup of Home.js where the pattern    { isVisible ? <Component props={props} /> : null }    is implemented, SocialMenu is always visible and its various comprising columns revealed according to the menuPosition prop (moreover, even if its visibility were handled by a boolean, its appearance/disappearance animation would be lost with that approach). So to prevent unnecessary rerenders from coords in Home.js the calls to utils.getStylesAndClassNamesForSocialMenu must be memoized

    useEffect(() => {
        if (isHandPointing) {
            handleHand(coords, pullTabRef.current, () => dispatch({type: 'toggleMenuPosition'}), 250)
            handleHand(coords, contactFormRef.current, () => dispatch({type: 'toggleContactForm'}), 250)
            handleHand(coords, infoSheetRef.current, () => dispatch({type: 'toggleInfoSheet'}), 250)
            handleHand(coords, cloudsOnRef.current, () => dispatch({type: 'toggleClouds'}), 250)
            handleHand(coords, cloudHazeOnRef.current, () => dispatch({type: 'toggleCloudHaze'}), 250)
        }
        //I would have had something like    handleHand(coords, handControllerRef, () => dispatch({type: 'toggleHandController'}), <rate>)    so that HandController could turn itself off (and obviously not be able to turn itself back on again). That would've been okay but was getting the error "HandController.js:51 Uncaught (in promise) TypeError: Cannot read properties of null (reading 'video'), at Object.onFrame (HandController.js:51:1), at Q (camera_utils.js:22:1), at camera_utils.js:22:1" when turning it off, and when turning it back on via mouse or touch a 'ghost' hand would appear where one's hand was even though handControllerOn was false
    }, [coords])

    return(
        <div className={classNames.socialMenuContainer} style={styles.socialMenuContainer}>

            <div className={classNames.socialIconsColumn1}>
                <i className='plane social-icon fa fa-plane-departure' onClick={() => { navigate('journeys'); window.location.reload()}} /> { /* If you don't call window.location.reload here too the path will change in your browser's address bar but the app won't navigate */ }
                <i className='cloud social-icon fa-solid fa-cloud' style={styles.cloudIcon} onClick={() => dispatch({type: 'toggleClouds'})} ref={cloudsOnRef} />
                <i className='cloud-haze fi fi-cloudy-gusts' style={styles.cloudHazeIcon} onClick={() => dispatch({type: 'toggleCloudHaze'})} ref={cloudHazeOnRef} />
                <i className='hand social-icon fa-solid fa-hand-sparkles' style={styles.handControllerIcon} onClick={() => dispatch({type: 'toggleHandController'})} />
            </div>

            <div className={classNames.socialIconsColumn2}>
                <i className='icon ion-md-mail mail social-icon' onClick={() => dispatch({type: 'toggleContactForm'})} ref={contactFormRef} />
                <a className='linkedin social-icon' href='https://www.linkedin.com/in/dvho' target='_blank' rel='noopener noreferrer'>
                    <i className='icon ion-logo-linkedin' />
                </a>
                <a className='resume social-icon' href='https://dvho.github.io/resume' target='_blank' rel='noopener noreferrer'>
                    <i className='icon ion-md-paper' />
                </a>
                <a className='github social-icon' href='https://github.com/dvho' target='_blank' rel='noopener noreferrer'>
                    <i className='icon ion-logo-github' />
                </a>
                <a className='npm social-icon' href='https://www.npmjs.com/~dvho' target='_blank' rel='noopener noreferrer'>
                    <i className='icon ion-logo-npm' />
                </a>
                <i className='fa fa-info-circle info social-icon' onClick={() => dispatch({type: 'toggleInfoSheet'})} ref={infoSheetRef} />
            </div>

            <i className={classNames.pullTab} onClick={() => dispatch({type: 'toggleMenuPosition'})}>
                <div className='pull-chevron-column-hand-controller-specific' ref={pullTabRef}/> { /* This invisible div of class pull-chevron-column-hand-controller-specific is inserted only so that it can carry the ref of the pull tab for the sake of the hand controller. Without it, i.e. with    ref={pullTabRef}    in the    i className={pullTabClasses}    , the hand controller would fire across the entire height of the SocialMenu as it does for onClick */ }
            </i>

        </div>
    )
}

export default SocialMenu
