import React from 'react'
import ReactPlayer from 'react-player'
import '../App.css'

//Style drop shadows for audio player interface
//Get library for styling slider thumb from AudioPlayer.js so that all colors in interface can react to veil opacity prop from App.js
//Annotate this component

class AudioPlayer extends React.PureComponent {
    constructor() {
        super()
        this.state = {
            trackLength: 0,
            totalSeconds: 0,
            isPlaying: false,
            hasEnded: true,
            totalTimeString: '0:00'
        }
    }

    handlePlayer = (type) => {

        if (type === 'stop') {
            this.setState({
                totalSeconds: 0,
                isPlaying: false,
                hasEnded: true
            })
            this.player.seekTo(0)
        }
        if (type === 'play') {
            this.setState({
                isPlaying: true,
                hasEnded: false
            })
        }
        if (type === 'pause') {
            this.setState({
                totalSeconds: this.state.totalSeconds,
                isPlaying: false
            })
        }
    }

    slidePlayback = (e) => {

        let totalSeconds = e.target.value
        this.player.seekTo(totalSeconds)

        let displaySeconds = totalSeconds % 60 < 10 ? `0${totalSeconds % 60}` : `${totalSeconds % 60}`
        let displayMinutes = Math.floor(totalSeconds / 59).toString()
        this.setState({
            totalSeconds: parseInt(totalSeconds),
            totalTimeString: `${displayMinutes}:${displaySeconds}`
        })
        console.log(this.state)
    }

    updatePlaybackTime = () => {

        let totalSeconds = this.state.hasEnded ? 0 : this.state.totalSeconds + 1
        let displaySeconds = totalSeconds % 60 < 10 ? `0${totalSeconds % 60}` : `${totalSeconds % 60}`
        let displayMinutes = Math.floor(this.state.totalSeconds / 59).toString()
        this.setState({
            totalSeconds: !this.state.isPlaying ? this.state.totalSeconds : this.state.totalSeconds + 1,
            totalTimeString: `${displayMinutes}:${displaySeconds}`
        })
    }

    ref = player => {
        this.player = player
    }

    render() {

        let song = this.props.song
        let containerHeight = this.props.canvasHeight * .07
        let containerWidth = this.props.screenWidth > this.props.canvasWidth ? this.props.canvasWidth * .8 : this.props.screenWidth * .8
        let left = this.props.screenWidth > this.props.canvasWidth ? this.props.canvasWidth  * .10 + this.props.margin : this.props.screenWidth * .10
        let bottom = this.props.screenWidth > this.props.canvasWidth ? this.props.canvasWidth  * .05 : this.props.screenWidth * .05
        let fontSize = this.props.canvasHeight / 30
        let iconDiameter =  this.props.canvasHeight * .05
        let iconMarginRight = iconDiameter * .15

        return(

            <div style={{position: 'absolute', width: containerWidth, height: containerHeight, left: left, bottom: bottom}}>

                <div style={{display: 'flex', flexDirection: 'row', position: 'absolute'}}>
                    <i onClick={()=>this.handlePlayer('play')} style={{cursor: 'pointer', paddingRight: `${iconMarginRight}px`, fontSize: `${iconDiameter}px`, color: 'rgba(1,1,30,.75)'}} className="fa fa-play-circle"></i>
                    <i onClick={()=>this.handlePlayer('stop')} style={{cursor: 'pointer', paddingRight: `${iconMarginRight}px`, fontSize: `${iconDiameter}px`, color: 'rgba(30,1,1,.75)'}} className="fa fa-stop-circle"></i>
                    <i onClick={()=>this.handlePlayer('pause')} style={{cursor: 'pointer', paddingRight: `${iconMarginRight}px`, fontSize: `${iconDiameter}px`, color: 'rgba(1,30,1,.75)'}} className="fa fa-pause-circle"></i>
                </div>

                    <p style={{position: 'absolute', margin: 0, right: 0, fontSize: fontSize, color: 'rgba(1,1,30,.75)'}}>{this.state.totalTimeString}</p>

                <input style={{marginTop: containerHeight}} className='slider' type='range' min='0' max={this.state.trackLength} value={this.state.totalSeconds} onChange={this.slidePlayback}/>

                <ReactPlayer
                    ref={this.ref}
                    url={song}
                    playing={this.state.isPlaying}
                    progressInterval={1000}
                    onProgress={this.updatePlaybackTime}
                    onEnded={() => this.setState({isPlaying: false, totalSeconds: 0, hasEnded: true})}
                    onDuration={(duration) => this.setState({trackLength: duration})}
                    />
            </div>

        )
    }
}

export default AudioPlayer
