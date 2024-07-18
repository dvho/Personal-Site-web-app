import React, { useMemo } from 'react'

import utils from '../_utils'

const { getStylesAndClassNamesForInfoSheet } = utils

const InfoSheet = ({ revealInfoSheet }) => {

    const { styles, classNames } = useMemo(() => getStylesAndClassNamesForInfoSheet(revealInfoSheet), [revealInfoSheet]) //Memoize calls to utils.getStylesAndClassNamesForInfoSheet, from which only the height and left props and a single className are calculated, to prevent the otherwise rapid unnecessary rerenders that would come from the coords changing in Home.js. Note, the coords prop is not even passed to InfoSheet but, unlike a couple of the other components' visibilities which are handled by booleans from directly within the markup of Home.js where the pattern    { isVisible ? <Component props={props} /> : null }    is implemented, InfoSheet's visibility is handled from within InfoSheet itself, so to prevent unnecessary rerenders from coords in Home.js the calls to utils.getStylesAndClassNamesForInfoSheet must be memoized

        return(
            <div className={classNames.infoSheet} style={styles.infoSheet}>
                <h1 className='info-sheet-heading'>How did I build this?</h1>
                <p>I built this app with React. Play any of my songs (still works in progress) from the audio interface below or simply click or tap on their titles. With mouse or touch, hold down on a title to navigate to that song's discrete page with lyrics. With my custom ML Hand controller you can control both the audio interface and the menu to the left and most of its options without touching the screen, keys or mouse.</p>
                <p>As for the installation art, when the clouds outside pass in front of the moon they dim the moonlight entering the room and further reveal my animated face, which you can interact with by mouse, touch or ML Hand controller. The visibility of my face is commensurate with the darkness of the room at any given moment.</p>
                <p>Click the options in the menu to the left to send me an email, view my resume, check out some of my other projects on GitHub and NPM. From the menu you can also toggle the clouds, cloud haze, the ML Hand controller, or click the plane icon to leave the main page entirely and see my travel photography.</p>
                <p>Notes: Cloud haze is off by default as it does strain the GPU. Use of my ML Hand controller with the cloud haze turned on imposes even more strain. It's intentional that toggling ML Hand controller on/off can only be done with mouse or touch, as turning it on with itself is paradoxically impossible.</p>
            </div>
        )
}

export default InfoSheet
