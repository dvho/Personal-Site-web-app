import React from 'react'
import '../App.css'
import AudioPlayer from './AudioPlayer'

class SingleTrack extends React.PureComponent {
    constructor() {
        super()
        this.state = {
            wideScreen: true,
            screenWidth: 0,
            canvasHeight: 0,
            canvasWidth: 0,
            margin: 0
        }
    }

    calcAllDimensions = e => {

        let screenWidth = window.visualViewport === undefined ? window.innerWidth : window.visualViewport.width //Chrome mobile uses window.visualViewport property instead of the window object directly
        let canvasHeight = window.visualViewport === undefined ? window.innerHeight : window.visualViewport.height //Chrome mobile uses window.visualViewport property instead of the window object directly
        let canvasWidth = Math.round(canvasHeight * 1.323572474377745) //screenWidth < canvasHeight * 1.323572474377745 ? screenWidth : Math.round(canvasHeight * 1.323572474377745)
        let wideScreen = screenWidth > canvasWidth ? true : false //This simple calculation was happening redundantly in so many components I decided to do it once here and subsequently pass as a prop to any of them that need it
        let margin = (screenWidth - canvasWidth) / 2

        if (e.type === 'load' || e.type === 'resize') { //Get the sizes of the screen, canvas and margins
            this.setState({
                wideScreen: wideScreen,
                screenWidth: screenWidth,
                canvasHeight: canvasHeight,
                canvasWidth: canvasWidth,
                margin: margin
            })
        }
    }

    componentDidMount() {
        //Fire up event listeners when SingleTrack.js mounts
        ['load', 'resize'].forEach(i => window.addEventListener(i, this.calcAllDimensions))
        const title = document.getElementById('title')
        const lyrics = document.getElementById('lyrics')
        title.innerHTML = `"${this.props.track.title}"`
        lyrics.innerHTML = lyrics.innerHTML + this.props.track.lyrics
    }

    componentWillUnmount() {
        window.location.reload() //If you don't call this on componentWillUnmount the home page won't reload when you nevigate back
    }

    render() {
        return (
            <div className='singleTrackPage' style={{width: this.state.screenWidth}}>
                <div id='lyrics'>
                    <h1 id='title'/>
                    <h2 id='author'>by David Homyk</h2><br/>
                </div>
                <AudioPlayer canvasWidth={this.state.canvasWidth} canvasHeight={this.state.canvasHeight} screenWidth={this.state.screenWidth} wideScreen={this.state.wideScreen} margin={this.state.margin} veilOpacity={.6} currentTrack={this.props.track} allTracks={[]} selectTrack={() => {}}/>

            </div>
        )
    }
}

export default SingleTrack
