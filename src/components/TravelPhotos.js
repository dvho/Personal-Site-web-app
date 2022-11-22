//Note, this component uses the native backward and forward buttons on the browser to both navitate from within the component and to go back to the home page. For the former it uses    window.history.go(1)    knowing both that a) if    typeof set === 'number'    the user must be navigating back from an individual album to the page with all the albums and that b) the only way to get to the page with all the albums for the first time is for the user to have come from Home.js where window history is always 0, because even if the user navigated to one of the SingleTrack.js pages first and then back to Home.js when SingleTrack.js unmounts    window.location.reload()    always runs which resets the window history to 0 so when on TravelPhotos.js the second page in the history, i.e. index 1, is ALWAYS the page with all the albums, hence doing    window.history.go(1)    will ALWAYS "navigate" the user back to the page with all the albums. The latter, namely going back to the home page, can thereby be handled by running    window.history.go(0)    or by using the useNavigate hook in    react-router-dom    to navigate back to Home.js with    navigate('')    . Unfortunately, though it seems like using    navigate('')    would be the less jank approach it doesn't work at all so    window.history.go(0)    has to be used in conjunction with a setTimeout around    window.location.reload()

import 'react-photo-view/dist/react-photo-view.css'

import React, { useEffect, useState } from 'react'

import data from '../assets/data'
import utils from './utils'

const TravelPhotos = () => {

    const [set, setSet] = useState('')

    const setSetWrapper = () => {
        setSet('')
    }

    useEffect(() => {
        window.onpopstate = () => {
            if (typeof set === 'number') { //If set is 'number' the user was on an album page...
                setSetWrapper() //...so setSet to an empty string
                window.history.go(1) //...and go to window.history 1, which you know is the page with all the albums
            } else { //...else if it's not 'number'
                //navigate('') //...navigate to Home.js
                window.history.go(0)
                setTimeout(() => { //...and reload the page after 100ms
                    window.location.reload() //If you don't call this here the path will change in your browser's address bar but the app won't navigate, and it must be called from a setTimeout otherwise the navigation will not have completed first
                }, 100)
            }
        }

    }, [set])


    return (
        <>{utils.parsePhotoAlbumData(data, set, setSet)}</>
    )
}

export default TravelPhotos
