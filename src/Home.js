import React from 'react'
import './App.css'
import config from './config'
import { Cloud, Veil, Face, PerformanceButton, AudioPlayer, Track, Ripple, ContactForm, InfoSheet, SocialMenu, SocialMenuLabels } from './components'

//NOTE: I needed to manually add "homepage": ".", to package.json in order get build/index.html to work.
//Local network 192.168.1.4:3000
//Method to deploy a subfolder (in this case build folder) to GitHub Pages https://gist.github.com/cobyism/4730490

// --Setting up a custom domain--
// ** Up to 4:36 ONLY - https://www.youtube.com/watch?v=mPGi1IHQxFM
// ** As of 2022, 03-21st in addition to adding GitHub's 4 IP addresses (185.199.108.153, 185.199.109.153, 185.199.110.153 and 185.199.111.153) to your DNS management as A records you also need to add    dvho.github.io    as a CNAME under name    www   in the DNS management otherwise, upon changing your custom domain settings for GitHub Pages, GitHub will get stuck on "Certificate Request Error: Certificate provisioning will retry automatically in a short period, please be patient." and remain at 1 of 3 "TLS certificate is being provisioned. This may take up to 15 minutes to complete." though it won't take 15 mins, it will just remain stuck. Your site will go live almost immediately at   http://davidhomyk.com   but never obtain the SSL certificate.
// ** AS OF 2019, 12-27th you only need to change the A records in the DNS management of the domain (davidhomyk.com at GoDaddy in this case) to the GitHub custom domain IPs, which can be found in step 4 of this article: https://help.github.com/en/github/working-with-github-pages/managing-a-custom-domain-for-your-github-pages-site , and then edit your GitHub repository's settings. You DO NOT need to create a CNAME file in the root directory of your project with the domain written out, which is convenient because in the case of any react app it would have to be in the build folder which is recompiled each time you do npm run build. So simply change the A records, then go to the settings of the GitHub project, scroll down to GitHub Pages and under Custom Domain type in the custom domain (davidhomyk.com in this case), click save, and check off "Enforce HTTPS." The problem that arises now is that you have two places from which you're effectively editing the GitHub Pages branch. When you need to deploy to the GitHub Pages branch again with   git subtree push --prefix build origin gh-pages   you'll get an error. You'll have to do   git push origin `git subtree split --prefix build master`:gh-pages --force   as per DBjelovuk in this thread   https://gist.github.com/tduarte/eac064b4778711b116bb827f8c9bef7b   which will subsequently break GitHub Pages' link to your custom domain, so you'll have to go back to the repo's settings, scroll to GitHub pages, type it in the custom domain field and check off "Enforce HTTPS" again. Then, of course, the next time you try to do   git subtree push --prefix build origin gh-pages   you'll run into this problem again and have to force push with   git push origin `git subtree split --prefix build master`:gh-pages --force   .
// TLDR: Once the A records in the DNS management of the domain (davidhomyk.com at GoDaddy in this case) have been changed to the GitHub custom domain IPs, to update the master and gh-pages moving forward 1) do   npm run build   2) stage and commit changes to master branch   3) push changes normally so do   git push origin master,   4) then do   git push origin `git subtree split --prefix build master`:gh-pages --force   5) then login to GitHub, go to the project's settings, scroll to the GitHub Pages secton and in the Custom Domain field type and save your custom domain

class Home extends React.PureComponent {
    constructor() {
        super()
        this.state = {
            devTest: false,
            wideScreen: true,
            screenWidth: 0,
            canvasHeight: 0,
            canvasWidth: 0,
            moonDiameter: 0,
            performanceButtonDiameter: 0,
            performanceBoost: true,
            margin: 0,
            leftColumnTracks: [],
            rightColumnTracks: [],
            titlesColumnsMargin: 0,
            xCoord: -1,
            yCoord: -1,
            rippleXCoord: -1,
            rippleYCoord: -1,
            rippleActive: false,
            allTracks: [],
            currentTrack: {},
            cloudNumber: 1,
            revealContactForm: false,
            revealInfoSheet: false,
            menuOpen: true,
            veilOpacity: .3,
            blinkActive: false,
            eyesJustSwitched: false,
            faceFrame: config.images.eyePosition.faceEmpty,
            t: null
        }
    }

    toggleDevTest = () => {
        if (!this.state.devTest) {
            this.setState({
                devTest: true,
                cloudNumber: 1
            })
        } else {
            setTimeout(() => window.location.reload(), 10) //setTimeout needed for Mozilla (not Chrome) per Morteza Ziyae on 2015, 01-27th in https://stackoverflow.com/questions/18967532/window-location-reload-not-working-for-firefox-and-chrome
        }
    }

    togglePerformanceBoost = () => {
        this.setState({
            performanceBoost: !this.state.performanceBoost,
            cloudNumber: 1
        })
    }

    toggleInfoSheet = () => {
        this.setState({
            revealInfoSheet: !this.state.revealInfoSheet,
            revealContactForm: false
        })
    }

    toggleContactForm = () => {
        this.setState({
            revealContactForm: !this.state.revealContactForm,
            revealInfoSheet: false
        })
    }

    toggleMenuOpen = () => {
        this.setState({
            menuOpen: !this.state.menuOpen
        })
    }

    selectTrack = currentTrack => {
        if (currentTrack.slug !== this.state.currentTrack.slug) { //Make sure the track isn't already selected
            this.setState({currentTrack: currentTrack})
            setTimeout(() => this.renderTracks(), 0) //Have to call renderTracks again to be able to pass the new this.state.currentTrack, and to do that without it being the penultimate this.state.currentTrack, it must be broken out into a setTimeout of 0ms
        }
    }

    userSwitchEyePosition = () => {

        let position

        if (this.state.yCoord >= 0 && this.state.yCoord < .2) {
            if (this.state.xCoord < .25) {position = config.images.eyePosition.clock945}
            if (this.state.xCoord >= .25) {position = config.images.eyePosition.clock1000}
            if (this.state.xCoord >= .35) {position = config.images.eyePosition.clock1030}
            if (this.state.xCoord >= .40) {position = config.images.eyePosition.clock1100}
            if (this.state.xCoord >= .50) {position = config.images.eyePosition.clock1200}
            if (this.state.xCoord >= .58) {position = config.images.eyePosition.clock100}
            if (this.state.xCoord >= .70) {position = config.images.eyePosition.clock200}
        }

        if (this.state.yCoord >= .2 && this.state.yCoord < .4) {
            if (this.state.xCoord < .35) {position = config.images.eyePosition.clock945}
            if (this.state.xCoord >= .35) {position = config.images.eyePosition.clock1000}
            if (this.state.xCoord >= .40) {position = config.images.eyePosition.clock1030}
            if (this.state.xCoord >= .45) {position = config.images.eyePosition.clock1100}
            if (this.state.xCoord >= .5) {position = config.images.eyePosition.clock1200}
            if (this.state.xCoord >= .55) {position = config.images.eyePosition.clock100}
            if (this.state.xCoord >= .65) {position = config.images.eyePosition.clock200}
            if (this.state.xCoord >= .75) {position = config.images.eyePosition.clock200}
            if (this.state.xCoord >= .85) {position = config.images.eyePosition.clock230}
        }

        if (this.state.yCoord >=.4 && this.state.yCoord < .5) {
            if (this.state.xCoord < .2) {position = config.images.eyePosition.clock930}
            if (this.state.xCoord >= .2) {position = config.images.eyePosition.clock915}
            if (this.state.xCoord >= .4) {position = config.images.eyePosition.clock900}
            if (this.state.xCoord >= .45) {position = config.images.eyePosition.faceEmpty}
            if (this.state.xCoord >= .55) {position = config.images.eyePosition.clock300}
            if (this.state.xCoord >= .7) {position = config.images.eyePosition.clock330}
        }

        if (this.state.yCoord >= .5) {
            if (this.state.xCoord < .15) {position = config.images.eyePosition.clock800}
            if (this.state.xCoord >= .15) {position = config.images.eyePosition.clock745}
            if (this.state.xCoord >= .30) {position = config.images.eyePosition.clock730}
            if (this.state.xCoord >= .45) {position = config.images.eyePosition.clock700}
            if (this.state.xCoord >= .55) {position = config.images.eyePosition.clock500}
            if (this.state.xCoord >= .625) {position = config.images.eyePosition.clock445}
            if (this.state.xCoord >= .70) {position = config.images.eyePosition.clock430}
            if (this.state.xCoord >= .775) {position = config.images.eyePosition.clock415}
            if (this.state.xCoord >= .85) {position = config.images.eyePosition.clock400}
        }

        this.setState({faceFrame: position})
    }

    autoSwitchEyePosition = () => {
        let position = Object.entries(config.images.eyePosition)[Math.floor(Math.random() * 37)][1] //Object.entries is a method that takes an object and returns an array whose elements are arrays of that object's key value pairs (i.e. each element is a [key, value]). The value is the image itself (it console.logs as a base64) so Object.entries(config.images.eyePosition)[0][1] would return the 1st image, Object.entries(config.images.eyePosition)[2][1] the 3rd, etc.
        let holdEyePosition = 500 + Math.random() * 500
        this.setState({faceFrame: position, eyesJustSwitched: true}) //Switch eyesJustSwitched to true
        setTimeout(() => {this.setState({eyesJustSwitched: false})}, holdEyePosition) //Wait 500 + Math.random() * 500 to switch eyesJustSwitched to false
    }

    blink = () => { //blink method sets a blinkDuration which is less than or equal to the repeatRate in blinkControl. The coeffiecients next to blinkDuration in the setTimeouts below go to 1.1, so the max blink duration isn't 250, but 275ms
        if (this.state.screenWidth === 0) { //this.blink was running before componentDidMount, which sets the screenWidth in state, causing Face.js to unnecessarily render 10 times (with each of the setTimeouts i.e. setStates below) but this prevents that from happening
            return
        }

        let blinkDuration = 100 + Math.random() * 150
        let blinkStareTimeCoefficient = 300 + Math.random() * 300
        let currentFaceFrame = this.state.faceFrame //the current faceFrame, which will eventually be switched around with an eye position method, is saved as "currentFaceFrame" and then the setTimeouts are run for the blinks from F to A and back to F again and finally back to currentFaceFrame. This way, no arguments need to be passed to blink.

        //First 2 setTimeouts below should be commented out. A blink looks more natural when eyes move rapidly to close and drag more on the way up, and omitting those frames depicted that much better.
        this.setState({blinkActive: true}) //Make blinkActive true
        this.setState({faceFrame: config.images.eyePosition.faceEmpty}) //Set faceFrame to faceEmpty, which reveals eyes facing forward, until first setTimeout is called in blinkDuration * .09

        // setTimeout(() => {
        //     this.setState({faceFrame: config.images.blink.faceBlinkF})
        // }, blinkDuration * .02)
        // setTimeout(() => {
        //     this.setState({faceFrame: config.images.blink.faceBlinkE})
        // }, blinkDuration * .05)
        setTimeout(() => {
            this.setState({faceFrame: config.images.blink.faceBlinkD})
        }, (blinkStareTimeCoefficient + blinkDuration * .09))
        setTimeout(() => {
            this.setState({faceFrame: config.images.blink.faceBlinkC})
        }, (blinkStareTimeCoefficient + blinkDuration * .14))
        setTimeout(() => {
            this.setState({faceFrame: config.images.blink.faceBlinkB})
        }, (blinkStareTimeCoefficient + blinkDuration * .20))
        setTimeout(() => {
            this.setState({faceFrame: config.images.blink.faceBlinkA})
        }, (blinkStareTimeCoefficient + blinkDuration * .27))
        setTimeout(() => {
            this.setState({faceFrame: config.images.blink.faceBlinkB})
        }, (blinkStareTimeCoefficient + blinkDuration * .36))
        setTimeout(() => {
            this.setState({faceFrame: config.images.blink.faceBlinkC})
        }, (blinkStareTimeCoefficient + blinkDuration * .47))
        setTimeout(() => {
            this.setState({faceFrame: config.images.blink.faceBlinkD})
        }, (blinkStareTimeCoefficient + blinkDuration * .60))
        setTimeout(() => {
            this.setState({faceFrame: config.images.blink.faceBlinkE})
        }, (blinkStareTimeCoefficient + blinkDuration * .75))
        setTimeout(() => {
            this.setState({faceFrame: config.images.blink.faceBlinkF})
        }, (blinkStareTimeCoefficient + blinkDuration * .92))
        setTimeout(() => {
            if (this.state.xCoord === -1) { //If there's no user input from mouse or touchscreen (i.e. has not been any user input from mouse or touchscreen in the past 10000ms, as per this.autoVsUserTimer) simply set the faceFrame back to currentFaceFrame and blinkActive back to false...
                this.setState({faceFrame: currentFaceFrame, blinkActive: false})
            } else { //...else if there has been user input in the past 10000ms don't set the last frame of the blink, just run this.userSwitchEyePosition instead and, of course, make blinkActive false.
            this.userSwitchEyePosition()
            this.setState({blinkActive: false})
            }
        }, (blinkStareTimeCoefficient + blinkDuration * 1.1))
    }

    dimVeil = (travelDuration, size) => {

        travelDuration *= 1000 //Convert seconds to milliseconds for use in setTimeouts.

        if (this.state.canvasWidth === 0) return //If canvasWidth hasn't been set yet it will be null and the calculations below will crash the app.

        let cloudIn = travelDuration / 3 //The point at which each cloud enters from the left in front of the moon happens to be exactly the center of the screen. It's travel duration is the full width of the view port (translateX(-100vw) through translateX(100vw) or translateX(100vw) through translateX(-100vw) in the case of the cloud icon being flipped... see App.css for these @keyframes) so the moment the cloud enters in front of the moon is exactly it's travelDuration divided by 2.
        let cloudOut = cloudIn + ((travelDuration/1.33) / (this.state.screenWidth / this.state.moonDiameter)) //The moment at which the cloud leaves the moon is the moment at which it enters the moon plus a function of its travelDuration (and, technically, also its size but I've averaged that between the largets and smallest cloud possibilities for this equation) and the diameter of the moon.

        setTimeout(() => { //Use cloudIn and cloudOut to affect the opacity of the veil (dimness of the room) which is the only prop passed to Veil.js
            this.setState({
                veilOpacity: this.state.veilOpacity + .15
            })
        }, cloudIn)

        setTimeout(() => { //Use cloudIn and cloudOut to affect the opacity of the veil (dimness of the room) which is the only prop passed to Veil.js
            this.setState({
                veilOpacity: this.state.veilOpacity - .15
            })
        }, cloudOut)
    }

    autoVsUserTimer = () => {
        this.setState({ //this.autoVsUserTimer is called whenever the mousemove, touchmove, or click events fire, which sets this.state.t to the function that, in turn, sets this.state.xCoords and this.state.yCoords to -1. Subsequently, every time this.autoVsUserTimer is called, clearTimeout is called on this.state.t, which is accessible from this.calcAllDimensionsCoordsAndResetClouds because it is simply a key in state.
            t: setTimeout(() => {
                this.setState({
                    xCoord: -1,
                    yCoord: -1
                })
            }, 10000)
        })
    }

    renderTracks = () => {

        const leftColumnTracks = []
        const rightColumnTracks = []
        const tracksArray = config.tracks //Back when config.tracks was an object with title keys and url values, was using Object.entries, which is a method that takes an object and returns an array whose elements are arrays of that object's key value pairs (i.e. each element is a [key, value]). In the case of images being a value, the value console.logs as a base64
        let titlesColumnsMargin = this.state.canvasHeight * .02

        let j

        for (j = 0; j < tracksArray.length; j++) {

            if (j < 5) {
                leftColumnTracks.push(<Track key={j} leftColumn={true} trackNumber={j + 1} selectTrack={this.selectTrack} track={tracksArray[j]} currentTrack={this.state.currentTrack} canvasHeight={this.state.canvasHeight} screenWidth={this.state.screenWidth} wideScreen={this.state.wideScreen} margin={this.state.margin}/>)
            } else {
                rightColumnTracks.push(<Track key={j} leftColumn={false} trackNumber={j + 1} selectTrack={this.selectTrack} track={tracksArray[j]} currentTrack={this.state.currentTrack} canvasHeight={this.state.canvasHeight} screenWidth={this.state.screenWidth} wideScreen={this.state.wideScreen} margin={this.state.margin}/>)
            }
        }

        this.setState({
            leftColumnTracks: leftColumnTracks,
            rightColumnTracks: rightColumnTracks,
            titlesColumnsMargin: titlesColumnsMargin,
            allTracks: tracksArray
        })
    }

    calcAllDimensionsCoordsAndResetClouds = (e) => {

        let screenWidth = window.visualViewport === undefined ? window.innerWidth : window.visualViewport.width //Chrome mobile uses window.visualViewport property instead of the window object directly
        let canvasHeight = window.visualViewport === undefined ? window.innerHeight : window.visualViewport.height //Chrome mobile uses window.visualViewport property instead of the window object directly
        let canvasWidth = Math.round(canvasHeight * 1.323572474377745) //screenWidth < canvasHeight * 1.323572474377745 ? screenWidth : Math.round(canvasHeight * 1.323572474377745)
        let wideScreen = screenWidth > canvasWidth ? true : false //This simple calculation was happening redundantly in so many components I decided to do it once here and subsequently pass as a prop to any of them that need it
        let moonDiameter = Math.round(canvasWidth * 0.199121522693997)
        let performanceButtonDiameter = canvasHeight * .025
        let margin = ((screenWidth - canvasWidth) / 2)

        if (e.type === 'load') { //Get the sizes of the screen, canvas, moon, performance toggle button, and reset cloudNumber on load
            this.setState({
                wideScreen: wideScreen,
                screenWidth: screenWidth,
                canvasHeight: canvasHeight,
                canvasWidth: canvasWidth,
                moonDiameter: moonDiameter,
                margin: margin,
                cloudNumber: 1,
                performanceButtonDiameter: performanceButtonDiameter
            })

        this.renderTracks() //Now that all the basic dimensions have been set in state render the tracks

        }

        if (e.type === 'resize') {
            setTimeout(() => window.location.reload(), 10) //setTimeout needed for Mozilla (not Chrome) per Morteza Ziyae on 2015, 01-27th in https://stackoverflow.com/questions/18967532/window-location-reload-not-working-for-firefox-and-chrome
        }

        if (e.type === 'mousemove' || e.type === 'touchmove' || e.type === 'click') { //Get the X and Y positions on mousemove, touchmove and click. Note: e.pageX and e.pageY have to be used instead of e.clientX and e.clientY because the latter two are properties of the MouseEvent only, and the former of both MouseEvent and TouchEvent. This caused an hours long headache that was eventually solved.
            let yCoord = e.pageY / canvasHeight
            let xCoord

            if (margin > 0) { //If there's a margin, calculate the xCoord of just the event over the canvasWidth
                xCoord = (e.pageX - margin) / canvasWidth
            } else {
                xCoord = e.pageX / screenWidth //else if there's no margin the visible canvasWidth is the same as the screenWidth
            }

            if (xCoord >= 0 && xCoord <= 1) { //If the xCoord is between 0 and 1

                if (e.type === 'click' || ((e.type === 'mousemove' || e.type === 'touchmove') && (this.state.xCoord !== xCoord || this.state.yCoord !== yCoord))) { //If event type is click or event type is either mousemove or touchmove AND there hasn't been a change in either xCoord nor yCoord in state

                    this.setState({ //set the new xCoord and yCoord in state
                        margin: margin,
                        xCoord: xCoord,
                        yCoord: yCoord
                    })

                    clearTimeout(this.state.t) //clearTimeout of this.state.t
                    this.autoVsUserTimer() //restart the this.state.t setTimeout function by calling its parent function, this.autoVsUserTimer
                    this.userSwitchEyePosition() //call this.userSwitchEyePosition and know that autoSwitchEyePosition isn't being called from either autoSwitchEyePositionControl nor blinkControl because this.state.xCoords would have to === -1 (and, by extention, this.state.yCoords would have to === -1) in order for that to happen.
                }

                if (e.type === 'click' && !this.state.rippleActive) { //If event type is click and the ripple is not currently active, set rippleActive to true and set ripple only coordinates for X and Y
                    this.setState({
                        rippleActive: true,
                        rippleXCoord: xCoord,
                        rippleYCoord: yCoord
                    })
                    setTimeout(
                        () => this.setState({ //After 200ms set rippleActive back to false
                            rippleActive: false
                        }),
                    400)
                }
            }
        }
    }

    componentDidMount() {
        //Fire up event listeners when Home.js mounts
        ['load', 'resize', 'mousemove', 'touchmove', 'click', 'onmousedown', 'onmouseup', 'touchstart', 'touchend'].forEach(i => window.addEventListener(i, this.calcAllDimensionsCoordsAndResetClouds)) //onmousedown and onmouseup are needed for the onHold function used in Track.js

        //Fire up the cloud's "game loop" as a controller that calls itself randomly between 1 and 9s and, in the interim, increases the cloudNumber by 1
        let cloudControl

        (cloudControl = () => {
            let repeatRate = 3500000 / this.state.screenWidth //* Math.random() //Repeat rate of cloudControl is a function of screen width (inversely proporional), since regardless of anything else, each cloud's path is the width of the viewport (vw)... this prevents the feeling of a cloud onslaught on narrow (mobile) screens
            this.setState({
                cloudNumber: this.state.cloudNumber + 1
            })
            setTimeout(cloudControl, repeatRate)
        })()

        let blinkControl
        (blinkControl = () => {
            let repeatRate = this.state.xCoord === -1 ? (5000 + Math.random() * 5000) : (875 + Math.random() * 3000) //Repeat rate of blinkControl must be more than the max time it would take to blink, which is blinkStareTimeCoefficient + blinkDuration * 1.1 in the blink method, which is called below. If this.state.xCoord === -1, i.e. the user is not firing events, it should be shorter than if the user is firing events.
            if (!this.state.eyesJustSwitched) { //If eyesJustSwitched is false (i.e. it's been longer than holdEyePosition, which is between 500ms and 1000ms, since eye position has switched) then blink, and if this.state.xCoord === -1, which means it's been longer than 10000ms since mousemove, touchmove or click event has fired, switch eye position again.
                if (this.state.xCoord === -1) {
                    this.autoSwitchEyePosition()
                }
                this.blink()
            }
            setTimeout(blinkControl, repeatRate)
        })()

        let autoSwitchEyePositionControl
        (autoSwitchEyePositionControl = () => {
            let repeatRate = 1000 + Math.random() * 2000
            if (!this.state.blinkActive && !this.state.eyesJustSwitched && this.state.xCoord === -1) { //If blink is not active and eyes were not just switched (i.e. it's been longer than holdEyePosition, which is between 500ms and 1000ms) and this.state.xCoord === -1, which means it's been longer than 10000ms since mousemove, touchmove or click events have fired, only then can you run autoSwitchEyePosition. Note, autoSwitchEyePosition can run from blinkControl as well so the condition !this.state.eyesJustSwitched must be reiterated here even through repeatRate for autoSwitchEyePositionControl is greater than 1000ms.
                this.autoSwitchEyePosition()
            }
            setTimeout(autoSwitchEyePositionControl, repeatRate)
        })()
    }

    render() { //Placing a rendering condition here to prevent a render until the essential calculations have been set in state at componentDidMount causes a display glitch where the canvas-parent ends up flush left.

        if (this.state.devTest) {
            return (
                <div className="canvas-parent" style={{opacity: this.state.screenWidth === 0 ? 0 : 1}}> {/* If the componentDidMount hasn't yet set all the initial values in state make the opacity 0, else 1 (.canvas-parent has a nice .3s transition on opacity in App.css) */}
                    <img alt={"back"} src={config.images.canvas.back} className="canvas" id="back-image"/>

                    <img alt={"back trees only"} src={config.images.canvas.backTreesOnly} className="canvas" id="back-trees-only-image"/>

                    <img alt={"main"} src={config.images.canvas.main} className="canvas" id="main-image"/>

                    <Veil opacity={.5} key={'a'}/>

                    <Face opacity={.4} key={'b'} faceFrame={this.state.faceFrame} screenWidth={this.state.screenWidth}/>

                    <img alt={"blank"} src={config.images.eyePosition.faceEmpty} className="canvas"/>

                    {/*<h1 style={{fontSize: 50, color: 'blue', position: 'absolute'}}>{this.state.xCoord}</h1>
                    <h1 style={{fontSize: 50, color: 'red', right: 0, position: 'absolute'}}>{this.state.yCoord}</h1> for testing purposes*/}

                    <AudioPlayer canvasWidth={this.state.canvasWidth} canvasHeight={this.state.canvasHeight} screenWidth={this.state.screenWidth} wideScreen={this.state.wideScreen} margin={this.state.margin} veilOpacity={this.state.veilOpacity} currentTrack={this.state.currentTrack} allTracks={this.state.allTracks} selectTrack={this.selectTrack} toggleDevTest={this.toggleDevTest}/>

                    <div style={{position: 'absolute', marginTop: this.state.titlesColumnsMargin, marginLeft: this.state.titlesColumnsMargin, left: 0}}>
                        {this.state.leftColumnTracks}
                    </div>
                    <div style={{position: 'absolute', marginTop: this.state.titlesColumnsMargin, marginRight: this.state.titlesColumnsMargin, right: 0}}>
                        {this.state.rightColumnTracks}
                    </div>

                </div>
            )
        }

        const allClouds = []
        let i

        for (i = 0; i < this.state.cloudNumber; i++) {
            allClouds.push(<Cloud key={i} canvasHeight={this.state.canvasHeight} dimVeil={this.dimVeil} performanceBoost={this.state.performanceBoost}/>)
        } //All this logic has to go here, not in a componentDidUpdate, because then I'd have to setState with a allClouds array and read it from the return and that's causing the "Maximum update depth exceeded" error, probably because, unlike in AudioPlayer.js, setState is being called after and on account of a loop above it. Remedy by not setting allClouds in state, just passing it along to the return from this smaller scope.

        return (
            <div className="canvas-parent" style={{opacity: this.state.screenWidth === 0 ? 0 : 1}}> {/* If the componentDidMount hasn't yet set all the initial values in state make the opacity 0, else 1 (.canvas-parent has a nice .3s transition on opacity in App.css) */}

                <img alt={"back"} src={config.images.canvas.back} className="canvas" id="back-image"/>

                {allClouds}

                <img alt={"back trees only"} src={config.images.canvas.backTreesOnly} className="canvas" id="back-trees-only-image"/>

                <img alt={"main"} src={config.images.canvas.main} className="canvas" id="main-image"/>

                <Veil opacity={this.state.veilOpacity} key={'a'}/>

                <Face opacity={(this.state.veilOpacity * .75)} key={'b'} faceFrame={this.state.faceFrame} screenWidth={this.state.screenWidth}/>

                <img alt={"blank"} src={config.images.eyePosition.faceEmpty} className="canvas"/>

                {/*<h1 style={{fontSize: 50, color: 'blue', position: 'absolute'}}>{this.state.xCoord}</h1>
                <h1 style={{fontSize: 50, color: 'red', right: 0, position: 'absolute'}}>{this.state.yCoord}</h1> for testing purposes*/}

                <AudioPlayer canvasWidth={this.state.canvasWidth} canvasHeight={this.state.canvasHeight} screenWidth={this.state.screenWidth} wideScreen={this.state.wideScreen} margin={this.state.margin} veilOpacity={this.state.veilOpacity} currentTrack={this.state.currentTrack} allTracks={this.state.allTracks} selectTrack={this.selectTrack} toggleDevTest={this.toggleDevTest}/>

                <div style={{position: 'absolute', marginTop: this.state.titlesColumnsMargin, marginLeft: this.state.titlesColumnsMargin, left: 0}}>
                    {this.state.leftColumnTracks}
                </div>
                <div style={{position: 'absolute', marginTop: this.state.titlesColumnsMargin, marginRight: this.state.titlesColumnsMargin, right: 0}}>
                    {this.state.rightColumnTracks}
                </div>

                <SocialMenuLabels menuOpen={this.state.menuOpen} canvasWidth={this.state.canvasWidth} screenWidth={this.state.screenWidth} wideScreen={this.state.wideScreen} margin={this.state.margin} veilOpacity={this.state.veilOpacity}/>

                <ContactForm toggleContactForm={this.toggleContactForm} revealContactForm={this.state.revealContactForm} canvasWidth={this.state.canvasWidth} screenWidth={this.state.screenWidth} wideScreen={this.state.wideScreen} margin={this.state.margin}/>

                <InfoSheet canvasWidth={this.state.canvasWidth} canvasHeight={this.state.canvasHeight} screenWidth={this.state.screenWidth} wideScreen={this.state.wideScreen} margin={this.state.margin} revealInfoSheet={this.state.revealInfoSheet}/>

                <SocialMenu toggleMenuOpen={this.toggleMenuOpen} toggleContactForm={this.toggleContactForm} toggleInfoSheet={this.toggleInfoSheet} menuOpen={this.state.menuOpen} wideScreen={this.state.wideScreen} margin={this.state.margin}/>

                <PerformanceButton performanceBoost={this.state.performanceBoost} performanceButtonDiameter={this.state.performanceButtonDiameter} togglePerformanceBoost={this.togglePerformanceBoost}/>

                { this.state.rippleActive ? <Ripple canvasHeight={this.state.canvasHeight} canvasWidth={this.state.canvasWidth} wideScreen={this.state.wideScreen} screenWidth={this.state.screenWidth} margin={this.state.margin} rippleXCoord={this.state.rippleXCoord} rippleYCoord={this.state.rippleYCoord}/> : null }

           </div>
        )
    }
}

export default Home
