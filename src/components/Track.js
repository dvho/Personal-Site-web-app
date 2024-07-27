import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import utils from '../_utils'

const { getStylesForTrack, onHold } = utils

const Track = ({ dispatch, track, currentTrack, trackNumber, leftColumn }) => {

    const navigate = useNavigate()

    const { title, slug } = track
    const isSelected = slug === currentTrack.slug

    const { styles } = useMemo(() => getStylesForTrack(isSelected, leftColumn), [isSelected, leftColumn]) //Memoize calls to utils.getStylesForTrack to prevent the otherwise rapid unnecessary rerenders that would come from the coords changing in Home.js

    const onClick = e => {
        e.preventDefault()
        dispatch({type: 'setCurrentTrack', currentTrack: track})
    }

    const onHoldWrapper = e => {
        onHold(() => {
                navigate(slug)
        }, 1000, e)
    }

    return(
        <div style={styles.trackContainer} onClick={e => onClick(e)} onMouseDown={e => onHoldWrapper(e)} onMouseUp={e => onHoldWrapper(e)} onTouchStart={e => onHoldWrapper(e)} onTouchEnd={e => onHoldWrapper(e)}>
            <h1 style={styles.trackTitle} className='title'>{trackNumber}. {title}</h1>
        </div>
    )
}

export default Track
