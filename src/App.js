import React from 'react'
import './App.css'
import config from './config'
import { Cloud, Veil } from './components'

//NOTE: Needed to manually add "homepage": ".", to package.json in order get build/index.html to work.
//Deploying a subfolder to GitHub Pages https://gist.github.com/cobyism/4730490

class App extends React.Component {
    constructor() {
        super()
        this.state = {
            canvasHeight: 0,
            canvasWidth: 0
        }
    }

    dimVeil = (rate) => {
        rate *= 500
        setTimeout(() => {
            console.log('cloud passed')
        }, rate)
    }

    calcWindowDimensions = () => { //Get the size of the canvas on load and on resize
        let screenWidth = window.innerWidth
        let canvasHeight = window.innerHeight
        let canvasWidth = screenWidth < canvasHeight * 1.323572474377745 ? screenWidth : Math.round(canvasHeight * 1.323572474377745)
        this.setState({
            canvasHeight: canvasHeight,
            canvasWidth: canvasWidth
        })
    }

    componentDidMount() {
        //Fire up event listeners when App.js mounts
        ['load', 'resize'].forEach(i => window.addEventListener(i, this.calcWindowDimensions))
    }


    render() {

        this.dimVeil(16)

        return (
            <div className="canvas-parent">

                <img alt={"back"} src={config.images.back} className="canvas" id="back-image"/>



                <img alt={"back trees only"} src={config.images.backTreesOnly} className="canvas" id="back-trees-only-image"/>

                <img alt={"main"} src={config.images.main} className="canvas" id="main-image"/>

                <Cloud travelDuration={16} key={1}/>

                <Veil opacity={.5} key={2}/>

                <h1 style={{position: 'absolute', color: 'white'}}>Width: {this.state.canvasWidth}, Height: {this.state.canvasHeight}</h1>

           </div>
        )
    }
}

export default App;
