import { BrowserRouter, useRoutes } from 'react-router-dom' // Changed from HashRouter to BrowserRouter

import Home from './Home'
import { SingleTrack, TravelPhotos } from './components'


import config from './_config'
import { photoData } from './assets/data'

const RoutesComponent = () => { //This component is designed to handle routing for the entire app...
    const routes = [ //...by constructing an array of routes from the config object, the photoData array and then adding two static routes, one for <TravelPhotos> when no photo album is open and all the photo albums are showing, and one for <Home> to handle the root route and to catch all remaining cases...
        ...config.tracks.map(i => ({
            path: `/${i.slug}`,
            element: <SingleTrack track={i} />
        })),
        ...photoData.map(i => ({
            path: `/travel-photos/${i.slug}`,
            element: <TravelPhotos initialPhotoAlbumSlug={i.slug} />
        })),
        { path: '/travel-photos', element: <TravelPhotos initialPhotoAlbumSlug={''} /> },
        { path: '*', element: <Home /> }
    ]

    const element = useRoutes(routes) //...then by using the useRoutes hook from react-router-dom to render the appropriate component based on the current route
    return element
}

const App = () => {

    return (
        <BrowserRouter>
            <RoutesComponent />
        </BrowserRouter>
    )
}

export default App
