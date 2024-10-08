//This component is designed for navigating back to and forth from the home page. It listens to the browser's 'popstate' event to detect when the user navigates using the browser's back or forward buttons. Upon detecting a 'popstate' event it uses the    navigate('/')    method from    react-router-dom    to programmatically navigate to Home.js without reloading the page. The previous implementation relied on    window.history.go    for navigation which was pretty jank

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import utils from '../_utils'

const TravelPhotos = ({ initialPhotoAlbumSlug }) => { //This component takes one argument, the initialPhotoAlbumSlug passed to it from App.js, and is designed to then dynamically handle the rendering of each of the individual photo album pages as well as the page containing the thumbnails for each of the photo albums...

    const navigate = useNavigate()

    const [photoAlbumSlug, setPhotoAlbumSlug] = useState(initialPhotoAlbumSlug) //...by first using the initialPhotoAlbumSlug to set the state of photoAlbumSlug...

    useEffect(() => {
        const handlePopState = e => { //...then by listening for the 'popstate' event to detect if/when the user navigates using the browser's back or forward buttons...
            if (typeof e.state === 'string') { //...knowing that if the e.state is a string it is a photo album slug which was correctly set by the call to window.history.pushState in the onClick of utils.parseAndRenderPhotoData...
                setPhotoAlbumSlug(e.state) //...and so sets the state of photoAlbumSlug to the e.state...
            } else { //..but if the e.state is not a string it's an object generated by the browser which will have an idx prop, i.e an index prop, which, if the user entered the website from https://davidhomyk.com then visited https://davidhomyk.com/travel-photos then visited an album will be 1 when they hit the back button because https://davidhomyk.com/travel-photos will have been the second route with an index of 1, and if the user entered the website from either https://davidhomyk.com/travel-photos and then clicked on a photo album or entered the website directly from https://davidhomyk.com/travel-photos/some-album-name and either way clicked the close button to arrive back on the /travel-photos page and then visited another album and clicked the close button to arrive back on the /travel-photos page again and then clicked the forward button the idx will be NaN, but in all other cases it will be 0 so...
                if (e.state.idx === 0) { //...if the idx is 0...
                    setPhotoAlbumSlug(initialPhotoAlbumSlug) //...you can safely set the photoAlbumSlug to the initialPhotoAlbumSlug...
                } else { //...otherwise...
                    setPhotoAlbumSlug('') //...you can safely set the photoAlbumSlug to an empty string because no photo album can be open in both remaining cases, i.e. that idx is 1 or that idx is NaN...
                }
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
