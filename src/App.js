import React from 'react'
import './App.css'
import config from './config'
import { Cloud, Veil, Face } from './components'

//NOTE: Needed to manually add "homepage": ".", to package.json in order get build/index.html to work.
//Deploying a subfolder to GitHub Pages https://gist.github.com/cobyism/4730490

// --Seting up a custom domain--
//https://www.youtube.com/watch?v=mPGi1IHQxFM
//https://medium.com/employbl/launch-a-website-with-a-custom-url-using-github-pages-and-google-domains-3dd8d90cc33b
//https://help.github.com/en/github/working-with-github-pages/managing-a-custom-domain-for-your-github-pages-site#configuring-a-records-with-your-dns-provider

class App extends React.PureComponent {
    constructor() {
        super()
        this.state = {
            screenWidth: 0,
            canvasHeight: 0,
            canvasWidth: 0,
            moonDiameter: 0,
            cloudNumber: 0,
            veilOpacity: .3,
            blinkActive: false,
            eyesJustSwitched: false,
            faceFrame: config.images.faceEmpty
        }
    }

    switchEyePosition = () => {
        let position = Object.entries(config.images)[5 + Math.floor(Math.random() * 38)][1] //Object.entries is a method takes an object and returns an array whose elements are arrays of that objects key value pairs (i.e. each element is a [key, value]). The value is the image itself (it console.logs as a base64) so Object.entries(config.images)[0][1] would return the 1st image, Object.entries(config.images)[2][1] the 3rd, etc. In this case the first key value pairs in the config.images object are not for the face so we start with Object.entries(config.images)[5][1], which is faceEmpty.
        let holdEyePosition = 500 + Math.random() * 500
        this.setState({faceFrame: position, eyesJustSwitched: true}) //Switch eyesJustSwitched to true
        setTimeout(() => {this.setState({eyesJustSwitched: false})}, holdEyePosition) //Wait 500 + Math.random() * 500 to switch eyesJustSwitched to false
    }

    blink = () => { //blink method sets a blinkDuration which is less than or equal to the repeatRate in blinkControl. The coeffiecients next to blinkDuration in the setTimeouts below go to 1.1, so the max blink duration isn't 250, but 275ms
        let blinkDuration = 100 + Math.random() * 150
        let blinkStareTimeCoefficient = 300 + Math.random() * 300
        let current = this.state.faceFrame //the current faceFrame, which will eventually be switched around with an eye position method, is saved as "current" and then the setTimeouts are run for the blinks from F to A and back to F again and finally back to current. This way, no arguments need to be passed to blink.

        //First 2 setTimeouts below should be commented out. A blink looks more natural when eyes move rapidly to close and drag more on the way up, and omitting those frames depicted that much better.
        this.setState({blinkActive: true}) //Make blinkActive true
        this.setState({faceFrame: config.images.faceEmpty}) //Set faceFrame to faceEmpty, which reveals eyes facing forward, until first setTimeout is called in blinkDuration * .09

        // setTimeout(() => {
        //     this.setState({faceFrame: config.images.faceBlinkF})
        // }, blinkDuration * .02)
        // setTimeout(() => {
        //     this.setState({faceFrame: config.images.faceBlinkE})
        // }, blinkDuration * .05)
        setTimeout(() => {
            this.setState({faceFrame: config.images.faceBlinkD})
        }, blinkStareTimeCoefficient + blinkDuration * .09)
        setTimeout(() => {
            this.setState({faceFrame: config.images.faceBlinkC})
        }, blinkStareTimeCoefficient + blinkDuration * .14)
        setTimeout(() => {
            this.setState({faceFrame: config.images.faceBlinkB})
        }, blinkStareTimeCoefficient + blinkDuration * .20)
        setTimeout(() => {
            this.setState({faceFrame: config.images.faceBlinkA})
        }, blinkStareTimeCoefficient + blinkDuration * .27)
        setTimeout(() => {
            this.setState({faceFrame: config.images.faceBlinkB})
        }, blinkStareTimeCoefficient + blinkDuration * .36)
        setTimeout(() => {
            this.setState({faceFrame: config.images.faceBlinkC})
        }, blinkStareTimeCoefficient + blinkDuration * .47)
        setTimeout(() => {
            this.setState({faceFrame: config.images.faceBlinkD})
        }, blinkStareTimeCoefficient + blinkDuration * .60)
        setTimeout(() => {
            this.setState({faceFrame: config.images.faceBlinkE})
        }, blinkStareTimeCoefficient + blinkDuration * .75)
        setTimeout(() => {
            this.setState({faceFrame: config.images.faceBlinkF})
        }, blinkStareTimeCoefficient + blinkDuration * .92)
        setTimeout(() => {
            this.setState({faceFrame: current, blinkActive: false}) //Make blinkActive false again
        }, blinkStareTimeCoefficient + blinkDuration * 1.1)
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

    calcAllDimensionsAndResetClouds = () => { //Get the size of the screen, canvas, and moon on both load and on resize
        let screenWidth = window.innerWidth
        let canvasHeight = window.innerHeight
        let canvasWidth = Math.round(canvasHeight * 1.323572474377745) // screenWidth < canvasHeight * 1.323572474377745 ? screenWidth : Math.round(canvasHeight * 1.323572474377745)
        let moonDiameter = Math.round(canvasWidth * 0.199121522693997)
        this.setState({
            screenWidth: screenWidth,
            canvasHeight: canvasHeight,
            canvasWidth: canvasWidth,
            moonDiameter: moonDiameter,
            cloudNumber: 0
        })
    }

    componentDidMount() {
        //Fire up event listeners when App.js mounts
        ['load', 'resize'].forEach(i => window.addEventListener(i, this.calcAllDimensionsAndResetClouds))
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
            let repeatRate = 600 + Math.random() * 5000 //Repeat rate of blinkControl must be less than the blinkDuration in the blink method, which is called below
            if (!this.state.eyesJustSwitched) { //If eyesJustSwitched is false (i.e. it's been longer than holdEyePosition, which is between 500ms and 1000ms, since eye position has switched) then switch eye position again and blink.
                this.switchEyePosition()
                this.blink()
            }
            setTimeout(blinkControl, repeatRate)
        })()

        let switchEyePositionControl
        (switchEyePositionControl = () => {
            let repeatRate = 1000 + Math.random() * 2000
            if (!this.state.blinkActive && !this.state.eyesJustSwitched) { //If blink is not active and eyes were not just switched (i.e. it's been longer than holdEyePosition, which is between 500ms and 1000ms) only then can you run switchEyePosition. Note, switchEyePosition can run from blinkControl as well so the condition !this.state.eyesJustSwitched must be reiterated here even through repeatRate for switchEyePositionControl is greater than 1000ms.
                this.switchEyePosition()
            }
            setTimeout(switchEyePositionControl, repeatRate)
        })()
    }

    render() {

        const allClouds = []
        let i

        for (i = 0; i < this.state.cloudNumber; i++) {
            allClouds.push(<Cloud key={i} canvasHeight={this.state.canvasHeight} dimVeil={this.dimVeil}/>)
        }

        return (
            <div className="canvas-parent">

                <img alt={"back"} src={config.images.back} className="canvas" id="back-image"/>

                {allClouds}

                <img alt={"back trees only"} src={config.images.backTreesOnly} className="canvas" id="back-trees-only-image"/>

                <img alt={"main"} src={config.images.main} className="canvas" id="main-image"/>

                <Veil opacity={this.state.veilOpacity} key={'a'}/>

                <Face opacity={(this.state.veilOpacity - .3) * .2} key={'b'} faceFrame={this.state.faceFrame}/>

           </div>
        )
    }
}

export default App;
