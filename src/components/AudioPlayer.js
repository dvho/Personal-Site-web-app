import React from 'react'
import ReactPlayer from 'react-player'
import '../App.css'

//Add onTouch and onClick to Play, Stop, Pause and slider
//Link drop box and filter shadows to this.state.performanceBoost in App.js

class AudioPlayer extends React.PureComponent {
    constructor() {
        super()
        this.state = {
            currentTrack: [], //This data shape is an array where the first element is the track title and the second is the url 
            trackLength: 0,
            totalSeconds: 0,
            isPlaying: false,
            hasEnded: true,
            totalTimeString: '0:00'
        }
    }

    handlePlayer = (type) => { //Handle the 3 buttons with one function (Play, stop, pause)

        if (this.state.currentTrack !== null) { //Don't let any controls be active unless there's a track cued in to this.state
            if (type === 'stop') {
                this.setState({
                    totalSeconds: 0,
                    isPlaying: false,
                    hasEnded: true
                })
                this.player.seekTo(0) //If stop, reset internal track to 0 as well.
            }
            if (type === 'play') {
                this.setState({
                    isPlaying: true,
                    hasEnded: false
                })
            }
            if (type === 'pause') {
                this.setState({
                    isPlaying: false
                })
            }
        }
    }

    slidePlaybackAndUpdatePlaybackTime = (e) => { //This is called onChange from the range input (i.e. slider) who's max is set to this.state.trackLength, which is set from onDuration={(duration) => this.setState({trackLength: duration})} in <ReactPlayer/>.

        let totalSeconds = e.target.value //Value between min and max (i.e., 0 and this.state.trackLength)
        this.player.seekTo(totalSeconds) //ReactPlayer method that takes seconds as an argument and updates internal position on the track

        let displaySeconds = totalSeconds % 60 < 10 ? `0${totalSeconds % 60}` : `${totalSeconds % 60}` //Calc seconds to display as a string
        let displayMinutes = Math.floor(totalSeconds / 59).toString() //Calc minutes to display as a string
        this.setState({
            totalSeconds: parseInt(totalSeconds), //Update totalSeconds to e.target.value, which ends up being a string when the slider is moved so you must parseInt
            totalTimeString: `${displayMinutes}:${displaySeconds}` //Concatenate string of minutes and seconds as a digital clock
        })
    }

    autoUpdatePlaybackTime = () => { //This function runs once per progressInterval, which is set to 1000ms in <ReactPlayer/>.

        let totalSeconds = this.state.hasEnded ? 0 : (this.state.isPlaying ? this.state.totalSeconds + 1 : this.state.totalSeconds) //If the track hasn't ended, is it playing? Then add 1s to this.state.totalSeconds each time this is called, else if it hasn't ended and is not playing (i.e. paused) don't unnecessarily add 1s to it.
        let displaySeconds = totalSeconds % 60 < 10 ? `0${totalSeconds % 60}` : `${totalSeconds % 60}` //Calc seconds to display as a string
        let displayMinutes = Math.floor(totalSeconds / 59).toString() //Calc minutes to display as a string
        this.setState({
            totalSeconds: !this.state.isPlaying ? this.state.totalSeconds : this.state.totalSeconds + 1, //If it's playing (i.e. not paused, and of course, not stopped since hasEnded would have also fired, update totalSeconds by 1)
            totalTimeString: `${displayMinutes}:${displaySeconds}` //Concatenate string of minutes and seconds as a digital clock
        })
    }

    ref = player => { //Must be included here so that this.player.seekTo(totalSeconds) can be called in slidePlaybackAndUpdatePlaybackTime function
        this.player = player
    }

    render() {

        if (this.props.currentTrack !== this.state.currentTrack) { //If the track changed, reset this.state.totalSeconds to -1, because you have to call this.autoUpdatePlaybackTime immediately afterward (from a setTimeout), which will advance this.state.totalSeconds + 1 to 0. Also pass 'play' to this.handlePlayer.
            this.setState({
                totalSeconds: -1,
            })

            setTimeout(() => {
                this.autoUpdatePlaybackTime()
            }, 5)

            this.handlePlayer('play')
        }

        this.setState({ //Update this.state.currentTrack to whatever was selected
            currentTrack: this.props.currentTrack
        })

        let performanceBoost = this.props.performanceBoost
        //Variables below are all calculated dynamically with each render and are based on App.js state properties canvasHeight, canvasWidth, screenWidth, margin, and veilOpacity
        let containerHeight = this.props.canvasHeight * .07
        let containerWidth = this.props.screenWidth > this.props.canvasWidth ? this.props.canvasWidth * .8 : this.props.screenWidth * .8
        let left = this.props.screenWidth > this.props.canvasWidth ? this.props.canvasWidth  * .10 + this.props.margin : this.props.screenWidth * .10
        let bottom = this.props.screenWidth > this.props.canvasWidth ? this.props.canvasWidth  * .05 : this.props.screenWidth * .05
        let sliderBoxShadowSpread = (this.props.veilOpacity - .3) * 18 //Only interesting thing here was that transition uses box-shadow property instead of boxShadow
        let sliderBoxShadowRgbaOpacity = (this.props.veilOpacity - .3) * .5 //Only interesting thing here was that transition uses box-shadow property instead of boxShadow
        let fontSize = this.props.canvasHeight / 30
        let totalTimeStringTextShadowSpread = (this.props.veilOpacity - .3) * 40 //Only interesting thing here was that transition uses text-shadow property instead of textShadow
        let totalTimeStringTextShadowRgbaOpacity = (this.props.veilOpacity - .3) //Only interesting thing here was that transition uses text-shadow property instead of textShadow
        let iconDiameter =  this.props.canvasHeight * .05
        let iconMarginRight = iconDiameter * .15
        let iconDropShadowSpread = (this.props.veilOpacity - .3) * 50
        let iconDropShadowRgbaOpacity = (this.props.veilOpacity - .3) * .7


        return(

            <div style={{position: 'absolute', width: containerWidth, height: containerHeight, left: left, bottom: bottom}}>

                <div style={{display: 'flex', flexDirection: 'row', position: 'absolute'}}>
                    <i onClick={()=>this.handlePlayer('play')} style={{cursor: 'pointer', paddingRight: `${iconMarginRight}px`, fontSize: `${iconDiameter}px`, color: 'rgba(1,1,30,.75)', filter: performanceBoost ? null : `drop-shadow(0px 0px ${iconDropShadowSpread}px rgba(255,255,255,${iconDropShadowRgbaOpacity})`, transition: performanceBoost ? null : 'filter 2.5s linear'}} className="fa fa-play-circle"></i>
                    <i onClick={()=>this.handlePlayer('stop')} style={{cursor: 'pointer', paddingRight: `${iconMarginRight}px`, fontSize: `${iconDiameter}px`, color: 'rgba(30,1,1,.75)', filter: performanceBoost ? null : `drop-shadow(0px 0px ${iconDropShadowSpread}px rgba(255,255,255,${iconDropShadowRgbaOpacity})`, transition: performanceBoost ? null : 'filter 2.5s linear'}} className="fa fa-stop-circle"></i>
                    <i onClick={()=>this.handlePlayer('pause')} style={{cursor: 'pointer', paddingRight: `${iconMarginRight}px`, fontSize: `${iconDiameter}px`, color: 'rgba(1,30,1,.75)', filter: performanceBoost ? null : `drop-shadow(0px 0px ${iconDropShadowSpread}px rgba(255,255,255,${iconDropShadowRgbaOpacity})`, transition: performanceBoost ? null : 'filter 2.5s linear'}} className="fa fa-pause-circle"></i>
                </div>

                <p style={{position: 'absolute', margin: 0, right: 0, fontSize: fontSize, textShadow: performanceBoost ? null : `0px 0px ${totalTimeStringTextShadowSpread}px rgba(255,255,255,${totalTimeStringTextShadowRgbaOpacity})`, color: 'rgba(30,1,1,.75)', transition: performanceBoost ? null : 'text-shadow 2.5s linear'}}>{this.state.totalTimeString}</p> {/* Need a fontFamily here */}

                <input style={{marginTop: containerHeight, boxShadow: performanceBoost ? null : `0px 0px ${sliderBoxShadowSpread}px rgba(255,255,255,${sliderBoxShadowRgbaOpacity})`, transition: performanceBoost ? null : 'box-shadow 2.5s linear'}} className='slider' type='range' min='0' max={this.state.trackLength} value={this.state.totalSeconds} onChange={this.slidePlaybackAndUpdatePlaybackTime}/>

                <ReactPlayer
                    ref={this.ref}
                    url={this.state.currentTrack[1]}
                    playing={this.state.isPlaying}
                    progressInterval={1000}
                    onProgress={this.autoUpdatePlaybackTime}
                    onEnded={() => this.setState({isPlaying: false, totalSeconds: 0, hasEnded: true})}
                    onDuration={(duration) => this.setState({trackLength: duration})}
                    />
            </div>

        )
    }
}

export default AudioPlayer
