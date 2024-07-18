import React, { memo } from 'react'

import utils from '../_utils'

const { getStylesAndRenderingVariablesForCloud, fluctuateVeilOpacity } = utils

const Cloud = ({ dispatch, cloudNumber, cloudHazeOn }) => {

    const { styles, classNames, renderingVariables } = getStylesAndRenderingVariablesForCloud(cloudHazeOn) //Unlike calls to utils.getStylesForAudioPlayer from AudioPlayer.js, utils.getStylesForFace from Face.js, utils.getStylesAndClassNamesForInfoSheet from InfoSheet.js etc., whose associated components render and rerender directly from within the markup of Home.js, Cloud.js is rendered from within cloudControl in the mounting useEffect of Home.js and so is not subject to the otherwise rapid unnecessary rerenders that would occur from the constant changing of coords in Home.js, therefore it doesn't need to be wrapped in useMemo like the others

    const { travelDuration, cloudWidth } = renderingVariables

    fluctuateVeilOpacity(dispatch, travelDuration, cloudWidth)

    return(
        <div
            className='clouds'
            id='cloud'
            onAnimationEnd={() => dispatch({type: 'removeCloud', cloudNumber})}
            style={{top: '50%'}}>
            <i
                style={styles.cloud}
                className={classNames.cloud}
            />
        </div>
    )
}

export default memo(Cloud)
