import React from 'react'
import ReactPlayer from 'react-player'

import config from '../_config'
import utils from '../_utils'

const { screenWidth, canvasHeight, canvasWidth, wideScreen, margin } = config.constants

//Need to track onLoad and only play if onLoad has completed

class AudioPlayer extends React.PureComponent {

    constructor() {

        super()

        this.reactPlayerRef = React.createRef()
        this.playButtonRef = React.createRef()
        this.stopButtonRef = React.createRef()
        this.pauseButtonRef = React.createRef()
        this.forwardButtonRef = React.createRef()
        this.backwardButtonRef = React.createRef()

        this.state = {
            currentTrack: [], //This data shape is an array where the first element is the track title and the second is the url
            trackLength: 0,
            totalSeconds: 0,
            isPlaying: false,
            hasEnded: true,
            totalTimeString: '0:00'
        }
    }

    changeTrackOrEnd = (forwardOrBackward) => {
        this.setState({ //First, by default, just set isPlaying to false, totalSeconds to 0 and hasEnded to true. If the track needs to change those will all be set again when componentDidUpdate calls this.handlePlayer('play')
            isPlaying: false,
            totalSeconds: 0,
            hasEnded: true
        })

        const allSlugs = config.tracks.map(i => i.slug)

        const trackNumber = allSlugs.indexOf(this.state.currentTrack.slug) //The trackNumber of the track that just played is the indexOf this.state.currentTrack.slug in allSlugs

        if (forwardOrBackward === 'forward' && trackNumber < allSlugs.length - 1) { //If forwardOrBackward === 'forward' and the track that just played wasn't the final track call the this.props.selectTrack method in Home.js and pass the next track to it.
            this.props.selectTrack(this.props.allTracks[trackNumber + 1])
        }
        if (forwardOrBackward === 'backward' && trackNumber > 0) { //If forwardOrBackward === 'backward' and a track number is set that is at least 1 call the this.props.selectTrack method in Home.js and pass the previous track to it (track numbers, of course, start at 0).
            this.props.selectTrack(this.props.allTracks[trackNumber - 1])
        }
    }

    handlePlayer = (type) => { //Handle the 3 buttons with one function (Play, stop, pause)
        if (type === 'stop') {
            this.setState({
                totalSeconds: 0,
                isPlaying: false,
                hasEnded: true
            })
            this.reactPlayerRef.seekTo(0) //If stop, reset internal track to 0 as well.
            setTimeout(() => this.autoUpdatePlaybackTime(), 0) //Don't wait the <= 1000ms for the playback counter to go back to 0, just do it now.
        }
        if (type === 'play') {
            if (this.props.currentTrack === this.state.currentTrack && Object.keys(this.props.currentTrack).length === 0) { //If type === 'play' and there's no track currently in Home.js' state, i.e. it's an empty object which was subsequently passed to AudioPlayer.js as this.props.currentTrack, it means there will also be no track in AudioPlayer.js' state.currentTrack, i.e. it will also be an empty object, so a way to check this is to simply with this.props.currentTrack === this.state.currentTrack and, if true, play the first track, and a way to play the first track at this point is simply to call this.changeTrackOrEnd and pass 'forward' as a param
                this.changeTrackOrEnd('forward')
            }
            this.setState({ //Regardless, set isPlaying to true and hasEnded to false
                isPlaying: true,
                hasEnded: false
            })
        }
        if (type === 'pause' && this.state.currentTrack && !this.state.hasEnded) { //If the 'pause' button is selected and there's a track loaded in that hasn't ended (i.e. the 'stop' button was not pressed) only then will pause work to either pause or unpause the playing track.
            this.setState({
                isPlaying: false //I used to have this as    isPlaying: !this.state.isPlaying    so that the pause button could toggle but once utils.handleHand    was integrated tapping pause with the HandController crashed the app with "Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops."
            })
        }
        if (type === 'forward') {
            if (this.props.allTracks.length > 0) {
                setTimeout(() => this.changeTrackOrEnd('forward'), 50) //I used to have this without the setTimeout but once utils.handleHand    was integrated tapping forward with the HandController always brought the focused track to the last track with warnings for each of the tracks in between: "<track name> is being deferred until the player has loaded." At 10ms the error was occasionally still happening so I bumped it up to 50ms.
            } else {
                this.setState({
                    totalSeconds: 0,
                    isPlaying: false,
                    hasEnded: true
                })
                this.reactPlayerRef.seekTo(0)
            }
        }
        if (type === 'backward') {
            if (this.props.allTracks.length > 0) {
                setTimeout(() => this.changeTrackOrEnd('backward'), 50) //I used to have this without the setTimeout but once utils.handleHand    was integrated tapping backward with the HandController always brought the focused track to the first track with warnings for each of the tracks in between: "<track name> is being deferred until the player has loaded." At 10ms the error was occasionally still happening so I bumped it up to 50ms.
            } else {
                this.setState({
                    totalSeconds: 0,
                    isPlaying: false,
                    hasEnded: true
                })
                this.reactPlayerRef.seekTo(0)
            }
        }
    }

    slidePlaybackAndUpdatePlaybackTime = (e) => { //This is called onChange from the range input (i.e. slider) who's max is set to this.state.trackLength, which is set from onDuration={(duration) => this.setState({trackLength: duration})} in <ReactPlayer/>.

        let totalSeconds = e.target.value //Value between min and max (i.e., 0 and this.state.trackLength)
        this.reactPlayerRef.seekTo(totalSeconds) //ReactPlayer method that takes seconds as an argument and updates internal position on the track

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

    reactPlayerRef = player => { //Must be included here so that this.reactPlayerRef.seekTo(totalSeconds) can be called in slidePlaybackAndUpdatePlaybackTime function
        this.player = player
    }

    playButtonRef = playButton => {
        this.playButton = playButton
    }

    stopButtonRef = stopButton => {
        this.stopButton = stopButton
    }

    pauseButtonRef = pauseButton => {
        this.pauseButton = pauseButton
    }

    fowardButtonRef = fowardButton => {
        this.fowardButton = fowardButton
    }

    backwardButtonRef = backwardButton => {
        this.backwardButton = backwardButton
    }

    componentDidUpdate() { //Must use componentDidUpdate, rather than render, to handle checking for changes between this.props.currentTrack and this.state.currentTrack, otherwise face warning in console “Cannot update during an existing state transition (such as within render). Render methods should be a pure function of props and state.”
        if (this.props.allTracks.length > 0 && this.props.currentTrack && this.props.currentTrack !== this.state.currentTrack) { //If this.props.allTracks.length > 0 it means AudioPlayer.js must be in Home.js not SingleTrack.js. If there was a track selected before (i.e this.props.currentTrack exists) and that track changed, reset this.state.totalSeconds to -1, because you have to call this.autoUpdatePlaybackTime immediately afterward (from a setTimeout), which will advance this.state.totalSeconds + 1 to 0. Also pass 'play' to this.handlePlayer.
            this.setState({
                totalSeconds: -1,
            })

            setTimeout(() => this.autoUpdatePlaybackTime(), 0) //Don't wait the <= 1000ms for the playback counter to go back to 0, just do it now.

            if (this.props.allTracks.length > 0) {
                this.handlePlayer('play')
            }
        }

        this.setState({ //Update this.state.currentTrack to whatever was selected
            currentTrack: this.props.currentTrack
        })

        if (this.props.isHandPointing) {
            utils.handleHand(this.props.coords, this.playButtonRef, () => this.handlePlayer('play'), 300)
            utils.handleHand(this.props.coords, this.stopButtonRef, () => this.handlePlayer('stop'), 300)
            utils.handleHand(this.props.coords, this.pauseButtonRef, () => this.handlePlayer('pause'), 300)
            utils.handleHand(this.props.coords, this.forwardButtonRef, () => this.handlePlayer('forward'), 300)
            utils.handleHand(this.props.coords, this.backwardButtonRef, () => this.handlePlayer('backward'), 300)
        }
    }

    render() {

        let veilOpacity = this.props.veilOpacity > .9 ? .9 : this.props.veilOpacity //If this.props.veilOpacity > .9 (rare, but it happens especially on narrower screens) fix it at .9
        //Variables below are all calculated dynamically with each render and are based on Home.js state properties canvasHeight, canvasWidth, screenWidth, wideScreen, margin, and veilOpacity
        let containerRgbaOpacity = (veilOpacity - .3) * .15 //Couldn't use regular opacity property because it was changing the opacity of all child elements. Setting it as the alpha channel for backgoundColor was the workaround. Also noteworthy is that the transition takes 'background-color' not 'backgroundColor' as the property in its string.
        let timeStringRgbaOpacity = .045 - containerRgbaOpacity
        let containerHeight = canvasHeight * .1
        let padding = containerHeight * .5
        let marginTop = containerHeight * -.15
        let totalTimeStringMarginTop = screenWidth / canvasHeight > .59 ? marginTop : 26
        let borderRadius = containerHeight * .25
        let containerWidth = wideScreen ? canvasWidth * .95 - padding * 2 : screenWidth * .95 - padding * 2
        let left = wideScreen ? canvasWidth  * .025 + margin : screenWidth * .025
        let bottom = wideScreen ? canvasWidth  * .025 : screenWidth * .025
        let fontSize = canvasHeight / 18
        let timeStringHorizontalPadding = canvasHeight / 50
        let timeStringBorderRadius = timeStringHorizontalPadding * 2
        let iconDiameter =  canvasHeight * .07
        let iconMarginRight = iconDiameter * .15
        let playIconClassName = this.state.isPlaying ? 'fa fa-play-circle play-active audio-icon' : (!this.state.isPlaying && !this.state.hasEnded ? 'fa fa-play-circle pause-active audio-icon' : 'fa fa-play-circle play-icon audio-icon')
        let pauseIconClassName = !this.state.isPlaying && !this.state.hasEnded ? 'fa fa-pause-circle pause-active audio-icon' : 'fa fa-pause-circle pause-icon audio-icon'

        return(

            <div style={{position: 'absolute', width: containerWidth, height: containerHeight, left: left, bottom: bottom, backgroundColor: `rgba(${this.props.allTracks.length > 0 ? '255,255,255' : '0,0,0'},${containerRgbaOpacity})`, transition: 'background-color 1.5s linear', padding: padding, borderRadius: borderRadius}}>

                <div style={{marginTop: marginTop, display: 'flex', flexDirection: 'row', position: 'absolute'}}>
                    { this.props.allTracks.length === 0 ? <i ref={backwardButtonRef => this.backwardButtonRef = backwardButtonRef}/> : <i onClick={() => this.handlePlayer('backward')} style={{paddingRight: `${iconMarginRight}px`, fontSize: `${iconDiameter}px`}} className='fa fa-chevron-circle-left next-and-previous-icons audio-icon' ref={backwardButtonRef => this.backwardButtonRef = backwardButtonRef}></i> }
                    <i onClick={() => this.handlePlayer('play')} style={{paddingRight: `${iconMarginRight}px`, fontSize: `${iconDiameter}px`}} className={playIconClassName} ref={playButtonRef => this.playButtonRef = playButtonRef}></i>
                    <i onClick={() => this.handlePlayer('pause')} style={{paddingRight: `${iconMarginRight}px`, fontSize: `${iconDiameter}px`}} className={pauseIconClassName} ref={pauseButtonRef => this.pauseButtonRef = pauseButtonRef}></i>
                    <i onClick={() => this.handlePlayer('stop')} style={{paddingRight: `${iconMarginRight}px`, fontSize: `${iconDiameter}px`}} className='fa fa-stop-circle stop-icon audio-icon' ref={stopButtonRef => this.stopButtonRef = stopButtonRef}></i>
                    { this.props.allTracks.length === 0 ? <i ref={forwardButtonRef => this.forwardButtonRef = forwardButtonRef}/> : <i onClick={() => this.handlePlayer('forward')} style={{paddingRight: `${iconMarginRight}px`, fontSize: `${iconDiameter}px`}} className='fa fa-chevron-circle-right next-and-previous-icons audio-icon' ref={forwardButtonRef => this.forwardButtonRef = forwardButtonRef}></i> }
                </div>

                <p style={{position: 'absolute', margin: 0, borderRadius: timeStringBorderRadius, paddingLeft: timeStringHorizontalPadding, paddingRight: timeStringHorizontalPadding, backgroundColor: `rgba(255,255,255,${timeStringRgbaOpacity})`, transition: 'background-color 1.5s linear', marginTop: totalTimeStringMarginTop, right: padding, fontFamily: config.appFont, fontSize: fontSize, color: 'rgba(30,1,1,.75)'}}>{this.state.totalTimeString}</p>

                <input style={{marginTop: containerHeight}} className='slider' type='range' min='0' max={this.state.trackLength} value={this.state.totalSeconds} onChange={this.slidePlaybackAndUpdatePlaybackTime}/>

                <ReactPlayer
                    ref={ref => this.reactPlayerRef = ref}
                    url={this.state.currentTrack.url}
                    playing={this.state.isPlaying}
                    progressInterval={1000}
                    onProgress={this.autoUpdatePlaybackTime}
                    onEnded={() => this.changeTrackOrEnd('forward')}
                    onDuration={(duration) => this.setState({trackLength: duration})}
                    />
            </div>
        )
    }
}

export default AudioPlayer
