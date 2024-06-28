//Note 1: As of 2022, 03-29th I'm integrating the npm package    gh-pages    as a dev dependency. To deploy, commit and use my custom domain: 1) Run    npm run deploy    2) Commit and push code to the master branch    3) Login to GitHub, go to the project's settings, scroll to the GitHub Pages section and in the Custom Domain field type and save my custom domain (see up to 4:36 ONLY at    https://www.youtube.com/watch?v=mPGi1IHQxFM    )    . My old method, which predates my incorporation of devDependencies.gh-pages in package.json, of deploying a subfolder (in this particular case the build folder) to GitHub Pages is explained here    https://gist.github.com/cobyism/4730490

//Note 2: I needed to manually add "homepage": ".", to package.json in order get build/index.html to work

//Note 3: To run the app over a local network on a mobile device use the local network IP and port, i.e. replace localhost: with <local network IP>:<port> like 123.456.7.8:3000 and if the camera is needed for HandController.js the error "getUserMedia() not supported" will be thrown on both Android Chrome and on iOS Safari. As of iOS 15.5 this can't be bypassed on iOS Safari but per Shantanu Tripathi on 2020, 04-28th in    https://stackoverflow.com/questions/34215937/getusermedia-not-supported-in-chrome    go to chrome://flags/#unsafely-treat-insecure-origin-as-secure    and as pointed out by Akhil S on 2020, 11-25th make sure the entered IP is prefixed with http:// e.g.    http://123.456.7.8:3000    . Note, the local network IP is at    System Preferences > Network > "Wi-Fi is connected to <Wi-Fi name> and has the IP address <Local network IP>"

//Note 4: See the history of setting up a custom domain at the bottom of this file

//Note 5: See how I cleaned up git history at the bottom of this file


import './App.css'
import React, { useReducer, useRef, useEffect } from 'react'

import { Cloud, Veil, Face, AudioPlayer, Track, Ripple, ContactForm, InfoSheet, SocialMenu, SocialMenuLabels, HandController } from './components'

import config from './_config'
import utils from './_utils'

const { screenWidth, canvasHeight, canvasWidth, margin } = config.constants

const initialState = {
    //Component visibility and performance features
    cloudsOn: true,
    cloudHazeOn: false,
    handControllerOn: false,
    revealContactForm: false,
    revealInfoSheet: false,
    menuPosition: 2,
    //Tracks
    allTracks: [],
    currentTrack: {},
    leftColumnTracks: [],
    rightColumnTracks: [],
    titlesColumnsMargin: 0,
    //Coords and controllers
    coords: { xCoordMoving: -1, yCoordMoving: -1, xCoordStatic: -1, yCoordStatic: -1 },
    isHandPointing: false,
    isRippling: false,
    isBlinking: false,
    //Eyes and main display
    faceFrame: config.images.eyePosition.faceEmpty,
    allClouds: [],
    veilOpacity: .45
}

const reducer = (state, action) => {
    const { type } = action
    switch (type) {
        case 'toggleMenuPosition': return {...state, menuPosition: (state.menuPosition + 1) % 4}
        case 'toggleContactForm': return {...state, revealContactForm: !state.revealContactForm, revealInfoSheet: false} //toggling revealContactForm on (or off) also always hides the info sheet
        case 'toggleInfoSheet': return {...state, revealInfoSheet: !state.revealInfoSheet, revealContactForm: false} //toggling revealInfoSheet on (or off) also always hides the contact form
        case 'toggleClouds':
            if (state.cloudsOn) { //If clouds are on...
                return {
                    ...state,
                    cloudsOn: false, //...turn them off...
                    cloudHazeOn: false, //...turn off cloud haze in case it's on...
                    allClouds: [] //...and remove all clouds
                }
            } else { //...otherwise if clouds are already off...
                return {
                    ...state,
                    cloudsOn: true, //...turn them on...
                    allClouds: [] //...and remove all clouds in this case as well, just in case clouds were last turned on from toggleCloudHaze
                }
            }
        case 'toggleCloudHaze':
            if (state.cloudsOn) { //If clouds are on...
                return {
                    ...state,
                    cloudHazeOn: !state.cloudHazeOn //...simply toggle cloud haze according to its current state..
                }
            } else { //...otherwise...
                return {
                    ...state,
                    cloudsOn: true, //...turn clouds on...
                    cloudHazeOn: true ///...and turn on cloud haze
                }
            }
        case 'toggleHandController': return {...state, handControllerOn: !state.handControllerOn}
        case 'allTracks': return {...state, allTracks: action.allTracks}
        case 'currentTrack': return {...state, currentTrack: action.currentTrack}
        case 'leftColumnTracks': return {...state, leftColumnTracks: action.leftColumnTracks}
        case 'rightColumnTracks': return {...state, rightColumnTracks: action.rightColumnTracks}
        case 'titlesColumnsMargin': return {...state, titlesColumnsMargin: action.titlesColumnsMargin}
        case 'coords': return {...state, coords: action.coords}
        case 'isHandPointing': return {...state, isHandPointing: action.isHandPointing}
        case 'isRippling': return {...state, isRippling: action.isRippling}
        case 'isBlinking': return {...state, isBlinking: action.isBlinking}
        case 'faceFrame': return {...state, faceFrame: action.faceFrame}
        case 'allClouds': return {...state, allClouds: action.allClouds}
        case 'removeCloud': return { ...state, allClouds: state.allClouds.filter(cloud => cloud.cloudNumber !== action.cloudNumber) }
        case 'veilOpacity': return {...state, veilOpacity: state.veilOpacity + action.veilOpacity}
        default: return state
    }
}


const Home = () => {

    const [state, dispatch] = useReducer(reducer, initialState)

    const { cloudsOn, cloudHazeOn, handControllerOn, revealContactForm, revealInfoSheet, menuPosition, allTracks, currentTrack, leftColumnTracks, rightColumnTracks, titlesColumnsMargin, coords, isHandPointing, isRippling, isBlinking, faceFrame, allClouds, veilOpacity } = state

    const coordsRef = useRef(coords)
    const allCloudsRef = useRef(allClouds)
    const cloudHazeOnRef = useRef(cloudHazeOn)
    const currentTrackRef = useRef(currentTrack)
    const faceFrameRef = useRef(faceFrame)
    const isBlinkingRef = useRef(isBlinking)


    const selectTrack = _currentTrack => {
        if (_currentTrack.slug !== currentTrackRef.current.slug) { //Make sure the _currentTrack isn't already selected
            dispatch({type: 'currentTrack', currentTrack: _currentTrack})
            setTimeout(() => renderTracks(), 0) //Have to call renderTracks again to be able to pass _currentTrack to currentTrack and to push that to the bottom of the execution stack so that the same penultimate currentTrack (the one that came before _currentTrack) doesn't wind up as currentTrack it must be broken out into a setTimeout of 0ms
        }
    }


    const renderTracks = () => {

        const leftColumnTracks = []
        const rightColumnTracks = []
        let titlesColumnsMargin = canvasHeight * .02

        const tracksArrayMidPoint = Math.ceil(config.tracks.length / 2) //Find the midpoint of the tracks array

        config.tracks.forEach((i, index) => {
            if (index < tracksArrayMidPoint) {
                leftColumnTracks.push(<Track key={index} leftColumn={true} trackNumber={index + 1} selectTrack={selectTrack} track={i} currentTrack={currentTrackRef.current} />)
            } else {
                rightColumnTracks.push(<Track key={index} leftColumn={false} trackNumber={index + 1} selectTrack={selectTrack} track={i} currentTrack={currentTrackRef.current} />)
            }
        })

        dispatch({type: 'leftColumnTracks', leftColumnTracks: leftColumnTracks})
        dispatch({type: 'rightColumnTracks', rightColumnTracks: rightColumnTracks})
        dispatch({type: 'titlesColumnsMargin', titlesColumnsMargin: titlesColumnsMargin})
        dispatch({type: 'allTracks', allTracks: config.tracks})
    }


    const handleEvents = e => {

        if (e.type === 'load') {
            renderTracks()
        }

        if (e.type === 'resize' && !navigator.userAgent.includes('iPhone')) { //Unfortunately I have to prevent this from working on iOS Safari because as of iOS 14 the new bottom address bar, which now dynamically appears on touchstart, also always fires the resize event
            setTimeout(() => window.location.reload(), 10) //setTimeout needed for Mozilla (not Chrome) per Morteza Ziyae on 2015, 01-27th in https://stackoverflow.com/questions/18967532/window-location-reload-not-working-for-firefox-and-chrome
        }

        if (e.type === 'pointermove' || e.type === 'click' || e.type === 'handmove') { //Get the X and Y positions on pointermove and on click. Note: e.pageX and e.pageY have to be used instead of e.clientX and e.clientY because the latter two are properties of the MouseEvent only, and the former of both MouseEvent and TouchEvent. This caused an hours long headache that was eventually solved.
            let xCoord, yCoord, isPointing

            if (e.type === 'click' || e.type === 'pointermove') {
                yCoord = e.pageY / canvasHeight

                if (margin > 0) { //If there's a margin, calculate the xCoordMoving of just the event over the canvasWidth
                    xCoord = (e.pageX - margin) / canvasWidth
                } else {
                    xCoord = e.pageX / screenWidth //else if there's no margin the visible canvasWidth is the same as the screenWidth
                }
            } else {
                xCoord = e.pageX
                yCoord = e.pageY
                isPointing = e.isPointing
            }

            if (xCoord >= 0 && xCoord <= 1) { //If the xCoord is between 0 and 1

                if (e.type === 'click' || ((e.type === 'pointermove' || e.type === 'handmove') && (coords.xCoordMoving !== xCoord || coords.yCoordMoving !== yCoord))) { //If event type is click or event type is either pointermove or handmove and there's been a change to either xCoordMoving or yCoordMoving set the new xCoordMoving and yCoordMoving in state
                    dispatch({type: 'coords', coords: { ...coordsRef.current, xCoordMoving: xCoord, yCoordMoving: yCoord}})
                    dispatch({type: 'isHandPointing', isHandPointing: isPointing})

                    utils.debounce(() => dispatch({type: 'coords', coords: { ...coordsRef.current, xCoordMoving: -1, yCoordMoving: -1 }}), 10000) //debounce the setting of coords to { xCoordMoving: -1, yCoordMoving: -1 } after 10000ms
                    if (!isBlinkingRef.current) {
                        utils.changeEyePositionWithUserInteraction(dispatch, { xCoordMoving: xCoord, yCoordMoving: yCoord }) //call    utils.changeEyePositionWithUserInteraction    with { xCoordMoving: xCoord, yCoordMoving: yCoord } and know that utils.autoSwitchEyePosition isn't being called from either autoSwitchEyePositionControl nor blinkControl because coordsRef.current.xCoordMoving would have to === -1 (and, by extension, coordsRef.current.yCoordMoving would also have to === -1) in order for that to happen
                    }
                }

                if (e.type === 'click' && !isRippling) { //If event type is click and the ripple is not currently active set isRippling to true and set static coordinates
                    dispatch({type: 'coords', coords: { ...coordsRef.current, xCoordStatic: xCoord, yCoordStatic: yCoord }})
                    dispatch({type: 'isRippling', isRippling: true})
                    setTimeout(
                        () => dispatch({type: 'isRippling', isRippling: false}), //After 400ms set isRippling back to false
                    400)
                }
            }
        }
    }


    useEffect(() => {
        //Fire up event listeners when Home.js mounts
        ['load', 'resize', 'pointermove', 'click', 'onmousedown', 'onmouseup', 'touchstart', 'touchend'].forEach(i => window.addEventListener(i, handleEvents)) //onmousedown and onmouseup are only needed for the onHold function used in Track.js

        let cloudControl
        (cloudControl = () => {
            if (cloudsOn) {
                const cloudNumber = allCloudsRef.current.length
                dispatch({type: 'allClouds', allClouds: [...allCloudsRef.current, <Cloud dispatch={dispatch} key={cloudNumber} cloudNumber={cloudNumber} cloudHazeOn={cloudHazeOnRef.current} />]})
                setTimeout(cloudControl, 4000 + 10000000 / screenWidth * Math.random()) //The rate of this setTimeout is a function of screenWidth (inversely proportional) because regardless of anything else, each cloud's path is the width of the viewport (vw)... this prevents the feeling of a cloud onslaught on narrow (mobile) screens
            }
        })() //TODO: refactor my reducer entirely so that all cases have logic inside them, which would involve creating some new cases

        let blinkControl
        (blinkControl = () => {
            let repeatRate = coordsRef.current.xCoordMoving === -1 ? (3000 + Math.random() * 3000) : (1000 + Math.random() * 3000) //Repeat rate of blinkControl must be more than the max time it would take to blink, which is blinkStareTimeCoefficient + blinkDuration * 1.1 in the blink method, which is called below. If coordsRef.current.xCoordMoving === -1, i.e. the user is not firing events, it should be shorter than if the user is firing events
                utils.blink(dispatch, faceFrameRef.current)
                if (coordsRef.current.xCoordMoving === -1) { //if coordsRef.current.xCoordMoving === -1, which means it's been longer than 10000ms since pointermove or click event has fired, switch eye position again.
                    utils.autoSwitchEyePosition(dispatch)
                }

            setTimeout(blinkControl, repeatRate)
        })()

        let autoSwitchEyePositionControl
        (autoSwitchEyePositionControl = () => {
            let repeatRate = 1000 + Math.random() * 3000
            if (coordsRef.current.xCoordMoving === -1) { //If blink is not active and eyes were not just switched (i.e. it's been longer than holdEyePosition, which is between 500ms and 1000ms) and coordsRef.current.xCoordMoving === -1, which means it's been longer than 10000ms since pointermove or click events have fired, only then can you run utils.autoSwitchEyePosition. Note, utils.autoSwitchEyePosition can run from blinkControl as well
                utils.autoSwitchEyePosition(dispatch)
            }
            setTimeout(autoSwitchEyePositionControl, repeatRate)
        })()

    }, [])

    useEffect(() => {
        //The difference in usage between <any-state-reference-from useRef>.current and its state directly from useReducer comes down to the timing and frequency of updates. <any-state-reference-from-useRef>.current is a mutable object whose changes do not trigger a re-render, which makes it suitable for storing values that change frequently (like coords) or that need to be accessed at a specific point in time that doesn't necessarily align with the render cycle (like currentTrack and cloudHazeOn). State from useReducer, on the other hand, is tied to the render cycle. When that state changes it triggers a re-render and the new state's values are used during the NEXT render. This makes state from useReducer suitable for storing values that, when changed, should cause the component to update and re-render with a new value (like cloudsOn). In some parts of the app state directly from useReducer is used to access the coords because those parts of the app only need the coords as they were at the start of the current render, not necessarily the most up-to-date coords. The same goes for parts of the app that use state directly from useReducer to access currentTrack, i.e. the AudioPlayer component already rendered in the markup; the state of currentTrack is a prop within AudioPlayer's rendered markup at the bottom of the Home component so it will always have the correct state of currentTrack. Note, generally all state access from within the main useEffect will require usage of <any-state-reference-from useRef>.current rather than its state directly from useReducer. Also note, all five of these references can be combined in the same useEffect without causing extra renders because useEffect runs after the render is committed to the screen, and updating a ref with .current does not cause a re-render
        coordsRef.current = coords
        allCloudsRef.current = allClouds
        cloudHazeOnRef.current = cloudHazeOn
        currentTrackRef.current = currentTrack
        faceFrameRef.current = faceFrame
        isBlinkingRef.current = isBlinking
    }, [coords, allClouds, cloudHazeOn, currentTrack, faceFrame])


    return (
        <div className="canvas-parent" style={{opacity: screenWidth === 0 ? 0 : 1}}> { /* If the componentDidMount hasn't yet set all the initial values in state make the opacity 0, else 1 (.canvas-parent has a nice .3s transition on opacity in App.css) */ }

            <img alt={"back"} src={config.images.canvas.back} className="canvas" id="back-image"/>

            { !cloudsOn ? null : allClouds }

            <img alt={"back trees only"} src={config.images.canvas.backTreesOnly} className="canvas" id="back-trees-only-image"/>

            <img alt={"main"} src={config.images.canvas.main} className="canvas" id="main-image"/>

            <Veil
                opacity={!cloudsOn ? .5 : veilOpacity}
                key={'a'}
                />

            <Face
                opacity={!cloudsOn ? .4 : veilOpacity * .75}
                key={'b'}
                faceFrame={faceFrame}
                />

            <img alt={"blank"} src={config.images.eyePosition.faceEmpty} className="canvas"/>

            { !handControllerOn ? null : <HandController handleEvents={handleEvents} /> }

            <AudioPlayer
                veilOpacity={veilOpacity}
                currentTrack={currentTrack}
                allTracks={allTracks}
                selectTrack={selectTrack}
                coords={coords}
                isHandPointing={isHandPointing}
                />

            <div style={{position: 'absolute', marginTop: titlesColumnsMargin, marginLeft: titlesColumnsMargin, left: 0}}>
                {leftColumnTracks}
            </div>
            <div style={{position: 'absolute', marginTop: titlesColumnsMargin, marginRight: titlesColumnsMargin, right: 0}}>
                {rightColumnTracks}
            </div>

            <SocialMenuLabels
                menuPosition={menuPosition}
                veilOpacity={veilOpacity}
                />

            <ContactForm
                dispatch={dispatch}
                revealContactForm={revealContactForm}
                />

            <InfoSheet
                revealInfoSheet={revealInfoSheet}
                />

            <SocialMenu
                dispatch={dispatch}
                menuPosition={menuPosition}
                cloudsOn={cloudsOn}
                cloudHazeOn={cloudHazeOn}
                handControllerOn={handControllerOn}
                isHandPointing={isHandPointing}
                coords={coords}
                />

            { isRippling ? <Ripple coords={coords} /> : null }

       </div>
    )
}

export default Home


/*

--History of setting up a custom domain--

• As of 2022, 03-21st in addition to adding GitHub's 4 IP addresses (185.199.108.153, 185.199.109.153, 185.199.110.153 and 185.199.111.153) to your DNS management as A records you also need to add    dvho.github.io    as a CNAME under name    www   in the DNS management otherwise, upon changing your custom domain settings for GitHub Pages, GitHub will get stuck on "Certificate Request Error: Certificate provisioning will retry automatically in a short period, please be patient." and remain at 1 of 3 "TLS certificate is being provisioned. This may take up to 15 minutes to complete." though it won't take 15 mins, it will just remain stuck. Your site will go live almost immediately at   http://davidhomyk.com   but never obtain the SSL certificate.

• As of 2019, 12-27th you only need to change the A records in the DNS management of the domain (davidhomyk.com at GoDaddy in this case) to the GitHub custom domain IPs, which can be found in step 4 of this article: https://help.github.com/en/github/working-with-github-pages/managing-a-custom-domain-for-your-github-pages-site , and then edit your GitHub repository's settings. You DO NOT need to create a CNAME file in the root directory of your project with the domain written out, which is convenient because in the case of any react app it would have to be in the build folder which is recompiled with each build. So simply change the A records, then go to the settings of the GitHub project, scroll down to GitHub Pages and under Custom Domain type in the custom domain (davidhomyk.com in this case), click save, and check off "Enforce HTTPS." The problem that used to arise with the old cobyism/4730490 method of deploying a subfolder to github pages was that you'd have two places from which you were effectively editing the GitHub Pages branch. When you needed to deploy to the GitHub Pages branch again with   git subtree push --prefix build origin gh-pages   you'd get an error. I had to do    git push origin `git subtree split --prefix build master`:gh-pages --force   as per DBjelovuk in this thread   https://gist.github.com/tduarte/eac064b4778711b116bb827f8c9bef7b   which subsequently breaks GitHub Pages' link to your custom domain, so I'd have to go back to the repo's settings, scroll to GitHub pages, type it in the custom domain field and check off "Enforce HTTPS" again. Then, of course, the next time I'd try to do   git subtree push --prefix build origin gh-pages   I'd run into this problem again and have to force push with   git push origin `git subtree split --prefix build master`:gh-pages --force   . My old TLDR was: "Once the A records in the DNS management of the domain (davidhomyk.com at GoDaddy in this case) have been changed to the GitHub custom domain IPs, to update the master and gh-pages moving forward 1) do   npm run build   2) stage and commit changes to master branch   3) push changes normally so do   git push origin master,   4) then do   git push origin `git subtree split --prefix build master`:gh-pages --force   5) then login to GitHub, go to the project's settings, scroll to the GitHub Pages secton and in the Custom Domain field type and save your custom domain"

*/


/*
Cleaning up git history in 5 steps:

1) I ran command    git log --pretty=format: --name-only | sort -u    to see a grand total list of files in git commit history

2) I ran    git filter-branch -f --tree-filter 'git rm -r -f --ignore-unmatch [History] && git rm -r -f --ignore-unmatch build && git rm -r -f --ignore-unmatch music' -- --all    to permanently delete old folders in the commit history that were at some point either removed or renamed and hence unnecessarily contributing to repositry bloat

3) I ran    git filter-branch -f --tree-filter 'git rm -f --ignore-unmatch assets-in-progress/Base\ Images\ READ\ ME.rtf && git rm -f --ignore-unmatch assets-in-progress/Base\ Images.psd && git rm -f --ignore-unmatch assets-in-progress/Face/Prototype\ and\ Eye\ Positions/IMG_0527.JPG && git rm -f --ignore-unmatch assets-in-progress/Face/Prototype\ and\ Eye\ Positions/IMG_0917.JPG && git rm -f --ignore-unmatch assets-in-progress/Face/Prototype\ and\ Eye\ Positions/IMG_2147.JPG && git rm -f --ignore-unmatch assets-in-progress/Face/Prototype\ and\ Eye\ Positions/IMG_6011.JPG && git rm -f --ignore-unmatch assets-in-progress/Face/Prototype\ and\ Eye\ Positions/IMG_6784.JPG && git rm -f --ignore-unmatch assets-in-progress/Face/Prototype\ and\ Eye\ Positions/IMG_7025.JPG && git rm -f --ignore-unmatch assets-in-progress/Face/Prototype\ and\ Eye\ Positions/IMG_7373.JPG && git rm -f --ignore-unmatch assets-in-progress/Face/Prototype\ and\ Eye\ Positions/IMG_8465.JPG && git rm -f --ignore-unmatch assets-in-progress/IMG_4303.JPG && git rm -f --ignore-unmatch assets-in-progress/Original\ Background.jpg && git rm -f --ignore-unmatch assets-in-progress/Original\ Main.jpg && git rm -f --ignore-unmatch CNAME && git rm -f --ignore-unmatch php/contactform.php && git rm -f --ignore-unmatch src/assets/back-trees-only.png && git rm -f --ignore-unmatch src/assets/back.png && git rm -f --ignore-unmatch src/assets/face-1L1.png && git rm -f --ignore-unmatch src/assets/face-1L2.png && git rm -f --ignore-unmatch src/assets/face-1L3.png && git rm -f --ignore-unmatch src/assets/face-1R1.png && git rm -f --ignore-unmatch src/assets/face-1R2.png && git rm -f --ignore-unmatch src/assets/face-1R3.png && git rm -f --ignore-unmatch src/assets/face-1R4.png && git rm -f --ignore-unmatch src/assets/face-2L1.png && git rm -f --ignore-unmatch src/assets/face-2L2.png && git rm -f --ignore-unmatch src/assets/face-2L3.png && git rm -f --ignore-unmatch src/assets/face-2L4.png && git rm -f --ignore-unmatch src/assets/face-2R2.png && git rm -f --ignore-unmatch src/assets/face-2R3.png && git rm -f --ignore-unmatch src/assets/face-2R4.png && git rm -f --ignore-unmatch src/assets/face-3L1.png && git rm -f --ignore-unmatch src/assets/face-3L2.png && git rm -f --ignore-unmatch src/assets/face-3L3.png && git rm -f --ignore-unmatch src/assets/face-3R1.png && git rm -f --ignore-unmatch src/assets/face-3R2.png && git rm -f --ignore-unmatch src/assets/face-3R3.png && git rm -f --ignore-unmatch src/assets/face-4L1.png && git rm -f --ignore-unmatch src/assets/face-4L2.png && git rm -f --ignore-unmatch src/assets/face-4L3.png && git rm -f --ignore-unmatch src/assets/face-4L4.png && git rm -f --ignore-unmatch src/assets/face-4R1.png && git rm -f --ignore-unmatch src/assets/face-4R2.png && git rm -f --ignore-unmatch src/assets/face-4R3.png && git rm -f --ignore-unmatch src/assets/face-4R4.png && git rm -f --ignore-unmatch src/assets/face-5L1.png && git rm -f --ignore-unmatch src/assets/face-5L2.png && git rm -f --ignore-unmatch src/assets/face-5L3.png && git rm -f --ignore-unmatch src/assets/face-5L4.png && git rm -f --ignore-unmatch src/assets/face-5L5.png && git rm -f --ignore-unmatch src/assets/face-5R1.png && git rm -f --ignore-unmatch src/assets/face-5R2.png && git rm -f --ignore-unmatch src/assets/face-5R3.png && git rm -f --ignore-unmatch src/assets/face-5R4.png && git rm -f --ignore-unmatch src/assets/face-blink-A.png && git rm -f --ignore-unmatch src/assets/face-blink-B.png && git rm -f --ignore-unmatch src/assets/face-blink-C.png && git rm -f --ignore-unmatch src/assets/face-blink-D.png && git rm -f --ignore-unmatch src/assets/face-blink-E.png && git rm -f --ignore-unmatch src/assets/face-blink-F.png && git rm -f --ignore-unmatch src/assets/face-empty.png && git rm -f --ignore-unmatch src/assets/face-main.png && git rm -f --ignore-unmatch src/assets/face-test.png && git rm -f --ignore-unmatch src/assets/main.png && git rm -f --ignore-unmatch src/assets/music/Baby\ Elephant-06.mp3 && git rm -f --ignore-unmatch src/assets/music/Believe\ in\ You-17.mp3 && git rm -f --ignore-unmatch src/assets/music/Driving\ and\ Crying-04.mp3 && git rm -f --ignore-unmatch src/assets/music/Fire\ and\ Acid\ Rain-12.mp3 && git rm -f --ignore-unmatch src/assets/music/Highest\ Mountain-11.mp3 && git rm -f --ignore-unmatch src/assets/music/How\ Could\ You\ Say\ That-08.mp3 && git rm -f --ignore-unmatch src/assets/music/I\ Will\ Not\ Forgive-11.mp3 && git rm -f --ignore-unmatch src/assets/music/I\ Wish\ It\ Were\ Raining-11.mp3 && git rm -f --ignore-unmatch src/assets/veil.png && git rm -f --ignore-unmatch src/index.css && git rm -f --ignore-unmatch src/logo.svg && git rm -f --ignore-unmatch src/serviceWorker.js' -- --all    to delete the remaining superfluous files in git history that were contributing to repositry bloat

4) I ran command    git reflog expire --expire=now --all && git gc --prune=now --aggressive    to reduce the size of the .git folder (because it keeps a backup for safety)

5) I ran command    git repack -ad    to pack loose objects into a pack file and remove redundant packs

*/
