import React from 'react'

import utils from '../_utils'

const { getStylesForRipple } = utils

const Ripple = ({ coords }) => {

    const { styles } = getStylesForRipple(coords)

    return(
        <div className='ripple' style={styles.ripple}></div>
    )
}

export default Ripple
