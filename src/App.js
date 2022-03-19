import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'


import Home from './Home'
import { SingleTrack } from './components'

import config from './config'

const App = () => {

    let paths, index, path, track

    paths = config.tracks.map(i => `/${i.slug}`)
    index = paths.indexOf(window.location.pathname)

    if (config.tracks.filter(i => `/${i.slug}` === window.location.pathname).length > 0) {
        path = window.location.pathname
        track = config.tracks[index]
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path='*' element={<Home />} />
                <Route exact path={path} element={<SingleTrack track={track}/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
