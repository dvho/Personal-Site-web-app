import { HashRouter, Route, Routes } from 'react-router-dom'


import Home from './Home'
import { SingleTrack, TravelPhotos } from './components'

import config from './config'

const App = () => {

    let hashes, index, path, track, element

    hashes = config.tracks.map(i => `#/${i.slug}`) //Make hashes from each of the slugs in    config.tracks[n].slug
    hashes.push('#/journeys') //...and push    #/journeys    as the final one.

    index = hashes.indexOf(window.location.hash) //...Because the hashes array begins with making hashes from the tracks in numerical order before    #/journeys    is pushed to the hashes array your    indexOf(window.location.hash)    will be the index...

    if (config.tracks.filter(i => `#/${i.slug}` === window.location.hash).length === 1) {
        path = window.location.hash.replace('#', '')
        track = config.tracks[index] //...that you can pass here in order to get the track...
        element = (() => <SingleTrack track={track}/>)() //...to pass here.
    } else if (window.location.hash === '#/journeys') {
        path = window.location.hash.replace('#', '')
        element = (() => <TravelPhotos/>)()
    } else {
        path = window.location.hash.replace('#', '')
        element = (() => <Home/>)()
    }

    return (
        <HashRouter>
            <Routes>
                { /* <Route path='*' element={<Home />} /> */ }
                <Route path={path} element={element}/>
            </Routes>
        </HashRouter>
    )
}

export default App
