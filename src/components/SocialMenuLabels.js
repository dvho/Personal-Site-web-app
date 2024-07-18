import React, { useMemo } from 'react'

import utils from '../_utils'

const { getStylesAndClassNamesForSocialMenuLabels } = utils

const SocialMenuLabels = ({ menuPosition, veilOpacity }) => {

    const { styles, classNames } = useMemo(() => getStylesAndClassNamesForSocialMenuLabels(menuPosition, veilOpacity), [menuPosition, veilOpacity]) //Memoize calls to utils.getStylesAndClassNamesForSocialMenuLabels to prevent the otherwise rapid unnecessary rerenders that would come from the coords changing in Home.js. Note, the coords prop is not even passed to SocialMenuLabels but, unlike other components' visibilities handled by booleans from within the markup of Home.js where the pattern    { isVisible ? <Component props={props} /> : null }    is implemented, SocialMenuLabels' visibility animates in and out with the menuPosition prop and its appearance/disappearance animation would be lost if handled in that manner so to prevent unnecessary rerenders from coords in Home.js the calls to utils.getStylesAndClassNamesForSocialMenuLabels must be memoized

    return(
        <div className={classNames.socialMenuLabelsContainer} style={styles.socialMenuLabelsContainer}>
            <div className='social-menu-label-block-mail'>
                <i className='fa fa-long-arrow-left arrow mail-arrow'/>
                <p className='social-text mail-social-text' style={styles.socialMenuLabels}>&nbsp;Email&nbsp;</p>
            </div>
            <div className='social-menu-label-block-resume'>
                <i className='fa fa-long-arrow-left arrow resume-arrow'/>
                <p className='social-text resume-social-text' style={styles.socialMenuLabels}>&nbsp;Resume&nbsp;</p>
            </div>
            <div className='social-menu-label-block-projects'>
                <i className='fa fa-long-arrow-left arrow github-arrow'/>
                <i className='fa fa-long-arrow-left arrow npm-arrow'/>
                <p className='social-text projects-social-text' style={styles.socialMenuLabels}>&nbsp;Projects&nbsp;</p>
            </div>
            <div className='social-menu-label-block-info'>
                <i className='fa fa-long-arrow-left arrow info-arrow'/>
                <p className='social-text info-social-text' style={styles.socialMenuLabels}>&nbsp;How&nbsp;did&nbsp;I&nbsp;build&nbsp;this&nbsp;?&nbsp;</p>
            </div>
        </div>
    )
}

export default SocialMenuLabels
