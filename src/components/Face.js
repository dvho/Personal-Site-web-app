import React, { useMemo } from 'react'

import config from '../_config'
import utils from '../_utils'

const { faceMain } = config.images.canvas
const { getStylesForFace } = utils

const Face = ({ faceFrame, veilOpacity }) => {

    const { styles } = useMemo(() => getStylesForFace(veilOpacity), [veilOpacity]) //Memoize calls to utils.getStylesForFace, within which only the opacity is calculated, to prevent the otherwise rapid unnecessary rerenders that would come from the coords changing in Home.js

    return(
        <div
            style={styles.face}>
            <img
                alt={'face-main'}
                src={faceMain}
                className='canvas'
                />
            <img
                alt={'face-frame'}
                src={faceFrame}
                className='canvas'
                />
        </div>
    )
}

export default Face
