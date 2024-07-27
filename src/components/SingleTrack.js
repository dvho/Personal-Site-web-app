import React, { useEffect } from 'react'

import AudioPlayer from './AudioPlayer'

import config from '../_config'

const { screenWidth } = config.constants

const SingleTrack = ({ track }) => {

    useEffect(() => {
            const title = document.getElementById('title')
            const lyrics = document.getElementById('lyrics')
            title.innerHTML = `"${track.title}"`
            lyrics.innerHTML = lyrics.innerHTML + track.lyrics
    }, [])

    return (
        <div className='singleTrackPage' style={{width: screenWidth}}>
            <div id='lyrics'>
                <h1 id='title'/>
                <h2 id='author'>by David Homyk</h2><br/>
            </div>

            <AudioPlayer veilOpacity={.6} currentTrack={track} />

        </div>
    )
}

export default SingleTrack
