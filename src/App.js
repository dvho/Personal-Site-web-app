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
            performanceButtonDiameter: 0,
            performanceBoost: false,
            xCoord: -1,
            yCoord: -1,
            cloudNumber: 1,
            veilOpacity: .3,
            blinkActive: false,
            eyesJustSwitched: false,
            faceFrame: config.images.eyePosition.faceEmpty,
            t: null
        }
    }

    userSwitchEyePosition = () => {
        //Add a conditional statement here that sets a let to the corresponding position and then setState to position
        console.log(this.state.xCoord, this.state.yCoord)

        let position

        if (this.state.xCoord <= .5) {
            position = config.images.eyePosition.faceEyePosition1R4
        }
        if (this.state.xCoord > .5) {
            position = config.images.eyePosition.faceEyePosition1L3
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
        let blinkDuration = 100 + Math.random() * 150
        let blinkStareTimeCoefficient = 300 + Math.random() * 300
        let current = this.state.faceFrame //the current faceFrame, which will eventually be switched around with an eye position method, is saved as "current" and then the setTimeouts are run for the blinks from F to A and back to F again and finally back to current. This way, no arguments need to be passed to blink.

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
            this.setState({faceFrame: current, blinkActive: false}) //Make blinkActive false again
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

    timer = () => {
        this.setState({ //this.timer is called whenever the mouseover, mousemove, touchstart, touchend and touchcancel events fire, which sets this.state.t to the function that, in turn, sets this.state.xCoords and this.state.yCoords to -1. Subsequently, every time this.timer is called, clearTimeout is called on this.state.t, which is accessible from this.calcAllDimensionsCoordsAndResetClouds because it is simply a key in state.
            t: setTimeout(() => {
                this.setState({
                    xCoord: -1,
                    yCoord: -1
                })
            }, 10000)
        })
    }

    calcAllDimensionsCoordsAndResetClouds = (e) => {

        let screenWidth = window.innerWidth
        let canvasHeight = window.innerHeight
        let canvasWidth = Math.round(canvasHeight * 1.323572474377745) //screenWidth < canvasHeight * 1.323572474377745 ? screenWidth : Math.round(canvasHeight * 1.323572474377745)
        let moonDiameter = Math.round(canvasWidth * 0.199121522693997)
        let performanceButtonDiameter = canvasHeight * .025

        if (e.type === 'load' || e.type === 'resize') { //Get the sizes of the screen, canvas, moon, performance toggle button, and reset cloudNumber on both load and on resize
            this.setState({
                screenWidth: screenWidth,
                canvasHeight: canvasHeight,
                canvasWidth: canvasWidth,
                moonDiameter: moonDiameter,
                cloudNumber: 1,
                performanceButtonDiameter: performanceButtonDiameter
            })
        } else if (e.type === 'mouseup' || e.type === 'mousedown' || e.type === 'mousemove' || e.type === 'touchstart' || e.type === 'touchend' || e.type === 'touchcancel') { //Get the X and Y positions on mouseover, mousemove, touchstart, touchend and touchcancel
            let margin = ((screenWidth - canvasWidth) / 2)
            let yCoord = e.clientY / canvasHeight
            let xCoord

            if (margin > 0) { //If there's a margin, calculate the xCoord of just the event over the canvasWidth
                xCoord = (e.clientX - margin) / canvasWidth
            } else {
                xCoord = e.clientX / screenWidth //else if there's no margin the visible canvasWidth is the same as the screenWidth
            }

            if (xCoord >= 0 && xCoord <= 1 && (this.state.xCoord !== xCoord || this.state.yCoord !== yCoord)) { //If the xCoord is between 0 and 1 and either the xCoord or yCoord has changed

                this.setState({ //set the new xCoord and yCoord in state
                    xCoord: xCoord,
                    yCoord: yCoord
                })

                clearTimeout(this.state.t) //clearTimeout of this.state.t
                this.timer() //restart the this.state.t timeOut function by calling its parent function, this.timer
                this.userSwitchEyePosition() //call this.userSwitchEyePosition and know that autoSwitchEyePosition isn't being called from either autoSwitchEyePositionControl nor blinkControl because this.state.xCoords would have to === -1 (and, by extention, this.state.yCoords would have to === -1) in order for that to happen.
            }
        }
    }

    componentDidMount() {
        //Fire up event listeners when App.js mounts
        ['load', 'resize', 'mousemove', 'mouseup','mousedown'].forEach(i => window.addEventListener(i, this.calcAllDimensionsCoordsAndResetClouds))
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
            let repeatRate = 875 + Math.random() * 3000 //Repeat rate of blinkControl must be less than the max time it would take to blink, which is blinkStareTimeCoefficient + blinkDuration * 1.1 in the blink method, which is called below
            if (!this.state.eyesJustSwitched) { //If eyesJustSwitched is false (i.e. it's been longer than holdEyePosition, which is between 500ms and 1000ms, since eye position has switched) then blink, and if this.state.xCoord === -1, which means it's been longer than 10000ms since mouseover, mousemove, touchstart, touchend and touchcancel events have fired, switch eye position again.
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
            if (!this.state.blinkActive && !this.state.eyesJustSwitched && this.state.xCoord === -1) { //If blink is not active and eyes were not just switched (i.e. it's been longer than holdEyePosition, which is between 500ms and 1000ms) and this.state.xCoord === -1, which means it's been longer than 10000ms since mouseover, mousemove, touchstart, touchend and touchcancel events have fired only then can you run autoSwitchEyePosition. Note, autoSwitchEyePosition can run from blinkControl as well so the condition !this.state.eyesJustSwitched must be reiterated here even through repeatRate for autoSwitchEyePositionControl is greater than 1000ms.
                this.autoSwitchEyePosition()
            }
            setTimeout(autoSwitchEyePositionControl, repeatRate)
        })()
    }

    render() {

        const allClouds = []
        let i

        for (i = 0; i < this.state.cloudNumber; i++) {
            allClouds.push(<Cloud key={i} canvasHeight={this.state.canvasHeight} dimVeil={this.dimVeil} performanceBoost={this.state.performanceBoost}/>)
        }

        return (
            <div className="canvas-parent">

                <img alt={"back"} src={config.images.canvas.back} className="canvas" id="back-image"/>

                {allClouds}

                <img alt={"back trees only"} src={config.images.canvas.backTreesOnly} className="canvas" id="back-trees-only-image"/>

                <img alt={"main"} src={config.images.canvas.main} className="canvas" id="main-image"/>

                <Veil opacity={this.state.veilOpacity} key={'a'}/>

                <Face opacity={(this.state.veilOpacity - .3) * .2} key={'b'} faceFrame={this.state.faceFrame}/>

                <img alt={"blank"} src={config.images.eyePosition.faceEmpty} className="canvas"/>

                <h1 style={{color: 'white', position: 'absolute', fontSize: 50}}>{this.state.xCoord}</h1>

                <div className="performanceButtonContainer" style={{width: this.state.performanceButtonDiameter * 2, height: this.state.performanceButtonDiameter * 2}} onClick={()=>{this.setState({performanceBoost: !this.state.performanceBoost, cloudNumber: 1})}}>
                    <div className="performanceButton" style={{backgroundColor: this.state.performanceBoost ? 'rgb(255,0,0)' : 'rgb(255,255,255)', width: this.state.performanceButtonDiameter, height: this.state.performanceButtonDiameter, margin: this.state.performanceButtonDiameter * .5}}></div>
                </div>

           </div>
        )
    }
}

export default App;
