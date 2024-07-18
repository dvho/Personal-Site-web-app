import React, { useMemo } from 'react'

import config from '../_config'
import utils from '../_utils'

const { veil } = config.images.canvas
const { getStylesForVeil } = utils

const Veil = ({ veilOpacity }) => {

    const { styles } = useMemo(() => getStylesForVeil(veilOpacity), [veilOpacity]) //Memoize calls to utils.getStylesForVeil, within which only the opacity is calculated, to prevent the otherwise rapid unnecessary rerenders that would come from the coords changing in Home.js

    return(
        <img
            alt={'veil'}
            src={veil}
            className='canvas'
            style={styles.veil}
            />
    )
}

export default Veil
