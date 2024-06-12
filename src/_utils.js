import { PhotoProvider, PhotoView } from 'react-photo-view' //https://react-photo-view.vercel.app/en-US/docs/getting-started
//import 'react-photo-view/dist/react-photo-view.css' //This is the default css file that comes with react-photo-view but I've commented it out because I'm using my own css file for the photo viewer

import config from './_config'


const utils = {

    onHold: (() => { //utils.onHold takes three arguments: A function to call on hold, a latency to determine hold duration and an event to check its type...
        let holdTimer = null //...declare holdTimer inside the closure scope of onHold so that it persists across multiple calls to utils.onHold and initialize it to null...

        return (fn, latency, event) => { //...return the actual onHold function...
            //...(and because the default is onClick don't call event.preventDefault() here)...
            const upListener = () => { //...in which a listener is defined for the mouseup and touchend events...
                clearTimeout(holdTimer) //...where if the mouse button or touch is released it clears the holdTimer...
                event.target.removeEventListener('mouseup', upListener) //...removes the listener for mouseup...
                event.target.removeEventListener('touchend', upListener) //...and removes the listener for touchend...
            }

            if (event.type === 'mousedown' || event.type === 'touchstart') { //...and if the event is a mousedown or touchstart...
                event.target.addEventListener('mouseup', upListener) //...add the mouseup listener to the target of the event...
                event.target.addEventListener('touchend', upListener) //...add the touchend listener to the target of the event...

                holdTimer = setTimeout(() => { //...set holdTimer to a setTimeout which calls the specified function after the specified latency...
                    fn() // ...wherein the function is called...
                    event.target.removeEventListener('mouseup', upListener) //...the mouseup listener is removed...
                    event.target.removeEventListener('touchend', upListener) //...and the touchend listener is removed...
                }, latency)
            }

            if (event.type === 'mouseup' || event.type === 'touchend') { //...if the event is a mouseup or touchend...
                clearTimeout(holdTimer) //...clear the holdTimer
            }
        }
    })(),

    throttle: (() => { //utils.throttle takes two arguments: A function to throttle and a latency within which to prevent it from being called. Once called the latency window must pass before the function can be called again...
        let throttleTimer = null //...declare throttleTimer inside the closure scope of throttle so that it persists across multiple calls to utils.throttle and initialize it to null...

        return (fn, latency) => { //...return the actual throttle function...
            if (throttleTimer === null) { //...wherein if throttleTimer is null (meaning no throttling is currently happening)...
                fn() //...the function is called immediately...
                throttleTimer = setTimeout(() => { //...throttleTimer is set to a setTimeout which sets itself back to null after the specified latency...
                    throttleTimer = null
                }, latency)
            } //...so that if throttleTimer is not null (meaning throttling is currently happening) the function call is ignored
        }
    })(),

    debounce: (() => { //utils.debounce takes three arguments: A function to debounce, a latency at which to debounce it and an isDoubleClick flag to specify behavior...
        let debounceClickCount = 0 //...declare debounceClickCount inside the closure scope of debounce so that it persists across multiple calls to utils.debounce and initialize it to 0...
        let debounceTimer = null //...declare debounceTimer inside the closure scope of debounce so that it persists across multiple calls to utils.debounce and initialize it to null...

        return (fn, latency, isDoubleClick) => { //...return the actual debounce function...
            debounceClickCount++ //...wherein on each call the debounceClickCount is immediately increased by 1...
            clearTimeout(debounceTimer) //...any debounceTimer is cleared...
            if (!isDoubleClick || (isDoubleClick && debounceClickCount > 1)) { //...and if the isDoubleClick flag is false or if it's true and the debounceClickCount has already reached 2...
                debounceTimer = setTimeout(() => { //...debounceTimer is set to a setTimeout...
                    fn() //...in which the function is called at the specified latency...
                    debounceClickCount = 0 //...and debounceClickCount is reset back to 0
                }, latency)
            }
        }
    })(),

    blink: (dispatch, faceFrame, coords) => { //utils.blink takes three arguments: Access to the reducer's dispatch function in Home.js, the faceFrame at the moment it's called and the coords at the moment it's called...

        let blinkDuration = 100 + Math.random() * 150 //...set blinkDuration to 100ms < blinkDuration < 250ms...

        dispatch({type: 'faceFrame', faceFrame: config.images.eyePosition.faceEmpty}) //...initialize faceFrame as config.images.eyePosition.faceEmpty (which reveals eyes facing forward) and necessarily remain at this position for a length of time equal to blinkDuration * config.constants.blinkFrameDelays[0], which is when the blink sequence begins...

        //...follow with a sequence of 10 setTimeouts that dictate the blink sequence and run at blinkDuration * config.constants.blinkFrameDelays[<index>] (where config.constants.blinkFrameDelays[9] is 1.1, not 1, so the last frame, which becomes either whatever was passed as faceFrame or whatever is returned from utils.changeEyePositionWithUserInteraction, could run at a max setTimeout of 600 + 250 * 1.1 = 875ms, which is still always sufficiently less than the repeatRate set forth in blinkControl in Home.js. Note, setTimeouts are run for frames from D to A, then back up to F. I would have included two earlier indices in constants.blinkFrameDelays, .02 and .05 for an earlier frame F and frame E, respectively, to come at the very beginning of the sequence but discovered that the blink looked more natural when the eyes moved rapidly to the closed position and then dragged a little more on the way up, and omitting those two frames F and E at the beginning depicted this much better...
        setTimeout(() => dispatch({type: 'faceFrame', faceFrame: config.images.blink.faceBlinkD}), blinkDuration * config.constants.blinkFrameDelays[0])
        setTimeout(() => dispatch({type: 'faceFrame', faceFrame: config.images.blink.faceBlinkC}), blinkDuration * config.constants.blinkFrameDelays[1])
        setTimeout(() => dispatch({type: 'faceFrame', faceFrame: config.images.blink.faceBlinkB}), blinkDuration * config.constants.blinkFrameDelays[2])
        setTimeout(() => dispatch({type: 'faceFrame', faceFrame: config.images.blink.faceBlinkA}), blinkDuration * config.constants.blinkFrameDelays[3])
        setTimeout(() => dispatch({type: 'faceFrame', faceFrame: config.images.blink.faceBlinkB}), blinkDuration * config.constants.blinkFrameDelays[4])
        setTimeout(() => dispatch({type: 'faceFrame', faceFrame: config.images.blink.faceBlinkC}), blinkDuration * config.constants.blinkFrameDelays[5])
        setTimeout(() => dispatch({type: 'faceFrame', faceFrame: config.images.blink.faceBlinkD}), blinkDuration * config.constants.blinkFrameDelays[6])
        setTimeout(() => dispatch({type: 'faceFrame', faceFrame: config.images.blink.faceBlinkE}), blinkDuration * config.constants.blinkFrameDelays[7])
        setTimeout(() => dispatch({type: 'faceFrame', faceFrame: config.images.blink.faceBlinkF}), blinkDuration * config.constants.blinkFrameDelays[8])
        setTimeout(() => {
            if (coords.xCoordMoving === -1) { //...and for that last frame if there hasn't been any user input from mouse, hand or touchscreen (i.e. there has been no such user input in the past 10000ms per setAutoVsUserTimer)...
                dispatch({type: 'faceFrame', faceFrame: faceFrame}) //...simply set the faceFrame back to what it was when utils.blink was first called...
            } else { //..otherwise...
                utils.changeEyePositionWithUserInteraction(dispatch, coords) //...run utils.changeEyePositionWithUserInteraction with coords instead
            }
        }, (blinkDuration * config.constants.blinkFrameDelays[9]))
    },

    changeEyePositionWithUserInteraction: (dispatch, coords) => { //utils.changeEyePositionWithUserInteraction takes two arguments. Access to the reducer's dispatch function in Home.js and an object of coords passed to it (which are simply xCoordMoving and yCoordMoving)...

        const { xCoordMoving, yCoordMoving } = coords //...destructure the object of coords into xCoordMoving and yCoordMoving...

        let position //...declare a position...

        //...define position depending on where xCoordMoving and yCoordMoving are...
        if (yCoordMoving >= 0 && yCoordMoving < .2) {
            if (xCoordMoving < .25) { position = config.images.eyePosition.clock945 }
            if (xCoordMoving >= .25) { position = config.images.eyePosition.clock1000 }
            if (xCoordMoving >= .35) { position = config.images.eyePosition.clock1030 }
            if (xCoordMoving >= .40) { position = config.images.eyePosition.clock1100 }
            if (xCoordMoving >= .50) { position = config.images.eyePosition.clock1200 }
            if (xCoordMoving >= .58) { position = config.images.eyePosition.clock100 }
            if (xCoordMoving >= .70) { position = config.images.eyePosition.clock200 }
        }

        if (yCoordMoving >= .2 && yCoordMoving < .4) {
            if (xCoordMoving < .35) { position = config.images.eyePosition.clock945 }
            if (xCoordMoving >= .35) { position = config.images.eyePosition.clock1000 }
            if (xCoordMoving >= .40) { position = config.images.eyePosition.clock1030 }
            if (xCoordMoving >= .45) { position = config.images.eyePosition.clock1100 }
            if (xCoordMoving >= .5) { position = config.images.eyePosition.clock1200 }
            if (xCoordMoving >= .55) { position = config.images.eyePosition.clock100 }
            if (xCoordMoving >= .65) { position = config.images.eyePosition.clock200 }
            if (xCoordMoving >= .75) { position = config.images.eyePosition.clock200 }
            if (xCoordMoving >= .85) { position = config.images.eyePosition.clock230 }
        }

        if (yCoordMoving >=.4 && yCoordMoving < .5) {
            if (xCoordMoving < .2) { position = config.images.eyePosition.clock930 }
            if (xCoordMoving >= .2) { position = config.images.eyePosition.clock915 }
            if (xCoordMoving >= .4) { position = config.images.eyePosition.clock900 }
            if (xCoordMoving >= .45) { position = config.images.eyePosition.faceEmpty }
            if (xCoordMoving >= .55) { position = config.images.eyePosition.clock300 }
            if (xCoordMoving >= .7) { position = config.images.eyePosition.clock330 }
        }

        if (yCoordMoving >= .5) {
            if (xCoordMoving < .15) { position = config.images.eyePosition.clock800 }
            if (xCoordMoving >= .15) { position = config.images.eyePosition.clock745 }
            if (xCoordMoving >= .30) { position = config.images.eyePosition.clock730 }
            if (xCoordMoving >= .45) { position = config.images.eyePosition.clock700 }
            if (xCoordMoving >= .55) { position = config.images.eyePosition.clock500 }
            if (xCoordMoving >= .625) { position = config.images.eyePosition.clock445 }
            if (xCoordMoving >= .70) { position = config.images.eyePosition.clock430 }
            if (xCoordMoving >= .775) { position = config.images.eyePosition.clock415 }
            if (xCoordMoving >= .85) { position = config.images.eyePosition.clock400 }
        }

        dispatch({type: 'faceFrame', faceFrame: position}) //...and dispatch it as faceFrame
    },

    parsePhotoAlbumData: (data, set, setSet) => { //TODO: Comment this procedure

        const pageType = typeof set === 'number' ? 'album' : 'albums' //If you're in an album the typeof set will be a number, otherwise it'll be an empty string, so pageType in the former case should be 'album' and in the latter 'albums'

        if (pageType === 'album') {

            const fullArray = data[set].fullString.split(' ') //An array of fill size image urls made from the single string of photo urls in data[set].fullString

            const thumbArray = data[set].thumbString.split(' ').map((i, index) => { //An array of thumbnail size image urls made from knowing the urls in fullArray and how to change each into thumbnail urls according to postimages.org's url naming convention
                let fullSizeOfIndex = fullArray[index]
                let img = fullSizeOfIndex.lastIndexOf('/')
                return `${i}${fullSizeOfIndex.substr(img)}`.replace('https://postimg.cc', 'https://i.postimg.cc')
            })

            return (
                <PhotoProvider speed={() => 500} loop={0} maskOpacity={0.9}> { /*    loop={0}    overrides the default of preloading 3  If you need an event upon closing the photo viewer you can use the afterClose prop */ }
                    <div className='card-page'>
                        {
                            fullArray.map((i, index) => {
                                return (
                                    <div key={index} className='thumb-container'>
                                        <PhotoView src={i} alt=''>
                                            <img src={thumbArray[index]} className='thumb' alt='' loading='lazy'/>
                                        </PhotoView>
                                    </div>
                                )
                            })
                        }
                    </div>
              </PhotoProvider>
            )
        } else {

            return (
                <div className='card-page'>
                    {
                        data.map((i, index) => {
                            return (
                                <div key={index} className='album-container'>
                                    <h2 className='album-name'>{i.albumName.substring(16) /* substring(16) simply removes the 16 character date I begin each albumName with in data.js */ }</h2>
                                    <img src={i.albumCover} className='album-cover' onClick={() => setSet(index)} alt='' loading='lazy'/>
                                </div>
                            )
                        })
                    }
                </div>
            )
        }
    }

}

export default utils
