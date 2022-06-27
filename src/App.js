import { HashRouter, Route, Routes } from 'react-router-dom'


import Home from './Home'
import { SingleTrack } from './components'

import config from './config'

const App = () => {

    let hashes, index, path, track

    hashes = config.tracks.map(i => `#/${i.slug}`)
    index = hashes.indexOf(window.location.hash)

    if (config.tracks.filter(i => `#/${i.slug}` === window.location.hash).length > 0) {
        path = window.location.hash.replace('#', '')
        track = config.tracks[index]
    }

    return (
        <HashRouter>
            <Routes>
                <Route path='*' element={<Home />} />
                <Route path={path} element={<SingleTrack track={track}/>}/>
            </Routes>
        </HashRouter>
    )
}

export default App
