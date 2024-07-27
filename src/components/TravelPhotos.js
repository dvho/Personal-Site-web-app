//This component is designed for navigating back to and forth from the home page. It listens to the browser's 'popstate' event to detect when the user navigates using the browser's back or forward buttons. Upon detecting a 'popstate' event it uses the    navigate('/')    method from    react-router-dom    to programmatically navigate to Home.js without reloading the page. The previous implementation relied on    window.history.go    for navigation which was pretty jank

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import utils from '../_utils'

const TravelPhotos = ({ initialPhotoAlbumSlug }) => { //This component takes one argument, the initialPhotoAlbumSlug passed to it from App.js, and is designed to then dynamically handle the rendering of each of the individual photo album pages as well as the page containing the thumbnails for each of the photo albums...

    const navigate = useNavigate()

    const [photoAlbumSlug, setPhotoAlbumSlug] = useState(initialPhotoAlbumSlug) //...by first using the initialPhotoAlbumSlug to set the state of photoAlbumSlug...

    useEffect(() => {
        const handlePopState = e => { //...then by listening for the 'popstate' event to detect when the user navigates using the browser's back or forward buttons...
            if (e.state) { //...using the e.state to set the state of photoAlbumSlug...
                if (typeof e.state === 'string') { //...knowing that if the e.state is a string it is a photo album slug which was correctly set by the call to window.history.pushState in the onClick of utils.parseAndRenderPhotoData...
                    setPhotoAlbumSlug(e.state) //...and so sets the state of photoAlbumSlug to the e.state...
                } else {
                    setPhotoAlbumSlug('') //...otherwise knows that e.state will be an object set by the browser when the user is on path '/travel-photos' and so correctly sets the photoAlbumSlug to an empty string because no photo album is open...
                }
            } else { //...otherwise if there is no e.state...
                setPhotoAlbumSlug('') //...sets the photoAlbumSlug to an empty string because no photo album is open...
            }
        }

        window.addEventListener('popstate', handlePopState) //...and then adds the event listener to the window object
        return () => window.removeEventListener('popstate', handlePopState) //...then removes the event listener when the component unmounts
    }, [])

    return (
        <> { utils.parseAndRenderPhotoData(photoAlbumSlug, setPhotoAlbumSlug, navigate) } </> //...and finally calls utils.parseAndRenderPhotoData to render either the appropriate photo album page or the page containing the thumbnails for each of the photo albums based on the state of photoAlbumSlug
    )
}

export default TravelPhotos
