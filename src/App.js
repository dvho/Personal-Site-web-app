import React from 'react'
import './App.css'
import config from './config'
import { Cloud, Veil } from './components'

//NOTE: Needed to manually add "homepage": ".", to package.json in order get build/index.html to work.
//Deploying a subfolder to GitHub Pages https://gist.github.com/cobyism/4730490

// --Seting up a custom domain--
//https://www.youtube.com/watch?v=mPGi1IHQxFM
//https://medium.com/employbl/launch-a-website-with-a-custom-url-using-github-pages-and-google-domains-3dd8d90cc33b
//https://help.github.com/en/github/working-with-github-pages/managing-a-custom-domain-for-your-github-pages-site#configuring-a-records-with-your-dns-provider

class App extends React.Component {
    constructor() {
        super()
        this.state = {
            firstCall: true,
            screenWidth: 0,
            canvasHeight: 0,
            canvasWidth: 0,
            moonDiameter: 0,
            cloudNumber: 0,
            veilOpacity: .6
        }
    }

    dimVeil = (travelDuration, size) => {

        travelDuration *= 1000

        if (this.state.canvasWidth === 0) return

        let cloudIn = travelDuration / 2
        let cloudOut = cloudIn + ((travelDuration/2) / (this.state.screenWidth / this.state.moonDiameter))

        setTimeout(() => {
            this.setState({
                veilOpacity: this.state.veilOpacity + .1,
                firstCall: false
            })
        }, cloudIn)

        setTimeout(() => {
            this.setState({
                veilOpacity: this.state.veilOpacity - .1,
                firstCall: false
            })
        }, cloudOut)
    }

    calcAllDimensions = () => { //Get the size of the canvas on load and on resize
        let screenWidth = window.innerWidth
        let canvasHeight = window.innerHeight
        let canvasWidth = Math.round(canvasHeight * 1.323572474377745) // screenWidth < canvasHeight * 1.323572474377745 ? screenWidth : Math.round(canvasHeight * 1.323572474377745)
        let moonDiameter = Math.round(canvasWidth * 0.199121522693997)
        this.setState({
            screenWidth: screenWidth,
            canvasHeight: canvasHeight,
            canvasWidth: canvasWidth,
            moonDiameter: moonDiameter
        })
    }

    componentDidMount() {
        //Fire up event listeners when App.js mounts
        ['load', 'resize'].forEach(i => window.addEventListener(i, this.calcAllDimensions))
        //Fire up "game loop"
        let linearControl
        (linearControl = () => {
            let repeatRate = 1000 + 9000 * Math.random()
            this.setState({
                cloudNumber: this.state.cloudNumber + 1
            })
            setTimeout(linearControl, repeatRate)
        })()
    }

    render() {

        const allClouds = []
        let i

        for (i = 0; i < this.state.cloudNumber; i++) {
            allClouds.push(<Cloud key={i} canvasHeight={this.state.canvasHeight} canvasWidth={this.state.canvasWidth} dimVeil={this.dimVeil}/>)
        }

        return (
            <div className="canvas-parent">

                <img alt={"back"} src={config.images.back} className="canvas" id="back-image"/>

                {allClouds}

                <img alt={"back trees only"} src={config.images.backTreesOnly} className="canvas" id="back-trees-only-image"/>

                <img alt={"main"} src={config.images.main} className="canvas" id="main-image"/>


                <Veil opacity={this.state.veilOpacity} key={2}/>

           </div>
        )
    }
}

export default App;
