import React from 'react'
import './App.css'
import config from './config'
import { Cloud, Veil } from './components'

//NOTE: Need to manually add "homepage": ".", to package.json in order get build/index.html working
//Deploying a subfolder to GitHub Pages https://gist.github.com/cobyism/4730490

class App extends React.Component {
    constructor() {
        super()
        this.state = {

        }
    }

    render() {

        return (
            <div className="canvas-parent">

                <img alt={"back"} src={config.images.back} className="canvas" id="back-image"/>

                <Cloud/>

                <img alt={"back trees only"} src={config.images.backTreesOnly} className="canvas" id="back-trees-only-image"/>

                <img alt={"main"} src={config.images.main} className="canvas" id="main-image"/>

                <Veil/>

           </div>
        )
    }
}

export default App;
