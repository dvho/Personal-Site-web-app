import './App.css'

import * as Hands from '@mediapipe/hands'
import * as drawingUtils from '@mediapipe/drawing_utils'
import ReactDOM from 'react-dom'
import { PhotoProvider, PhotoView } from 'react-photo-view' //https://react-photo-view.vercel.app/en-US/docs/getting-started
//import 'react-photo-view/dist/react-photo-view.css' //This is the default css file that comes with react-photo-view but I've commented it out because I'm using my own css file for the photo viewer

import config from './_config'
import { photoData } from './assets/data'

const { canvasHeight, canvasWidth, margin } = config.constants
const { dummyImage } = config.images


const utils = {

    onHold: (() => { //The function returned by this onHold IIFE is actually the one being called, hence, calling utils.onHold(fn, latency, event) works even though onHold appears to take no parameters. It's structure as an IIFE's is to set up the closure scope for holdTimer outside of the returned function, ensuring that it's private and persistent across multiple calls to utils.onHold, so the three arguments it takes are: A function to call on hold, a latency to determine hold duration and an event to check its type...
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

    throttle: (() => { //The function returned by this throttle IIFE is actually the one being called, hence, calling utils.throttle(fn, latency) works even though throttle appears to take no parameters. It's structure as an IIFE's is to set up the closure scope for throttleTimer outside of the returned function, ensuring that it's private and persistent across multiple calls to utils.throttle, so the two arguments it takes are: A function to throttle and a latency within which to prevent it from being called. Once called the latency window must pass before the function can be called again...
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

    debounce: (() => { //The function returned by this debounce IIFE is actually the one being called, hence, calling utils.debounce(fn, latency, isDoubleClick) works even though debounce appears to take no parameters. It's structure as an IIFE's is to set up the closure scope for debounceClickCount and for debounceTimer outside of the returned function, ensuring that it's private and persistent across multiple calls to utils.debounce, so the three arguments it takes are: A function to debounce, a latency at which to debounce it and an isDoubleClick flag to specify behavior...
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

    drawHand: (canvasCtx, results, handleEvents) => { //utils.drawHand takes three arguments, canvasCtx, results and handleEvents, and is called from the onResults callback function in HandController, which processes the results from MediaPipe's Hands model. This callback is triggered on each frame captured from webcamRef.current.video, i.e. the webcam, as onResults is connected to MediaPipe's Hands model via hands.onResults(onResults) within HandController's useEffect. The useEffect is set up to re-initialize MediaPipe's Hands model and the webcam feed whenever onResults changes, which due to its dependency array, should only happen upon the initial component mount. However since onResults is wrapped in a useCallback with an empty dependency array it does not change across renders, ensuring that the setup for MediaPipe's Hands model and the webcam feed is done only once. Within onResults utils.drawHand is called to draw the detected hand landmarks on the canvas for each frame, utilizing video frames from webcamRef.current.video as input. This setup facilitates the continuous processing and visualization of hand tracking at the framerate of the webcam. Hand landmarks are illustrated at    https://github.com/google-ai-edge/mediapipe/blob/master/docs/solutions/hands.md    . utils.drawHand further calls utils.isPointing and if the hand is indeed pointing it identifies the end of the index finger as the coordinates to pass in my custom made event, otherwise it identifies the base of the index finger as coordinates to pass in my custom made event. The handleEvents function is then called with my custom event type 'handmove' with the identified coordinates and the isPointing boolean...

        if (results.multiHandLandmarks) {

            const connect = drawingUtils.drawConnectors
            const landmark = drawingUtils.drawLandmarks

            for (const landmarks of results.multiHandLandmarks) {
                const points = results.multiHandLandmarks[0]
                const isPointing = utils.isPointing(points)
                let pageX, pageY
                connect(canvasCtx, landmarks, Hands.HAND_CONNECTIONS, {color: isPointing ? 'rgb(255,0,0)' : 'rgb(255,255,255)', lineWidth: Math.abs(points[9].z * 100)})
                if (isPointing) {
                    landmark(canvasCtx, landmarks.filter((i, index) => index === 8), {color: 'rgba(255,255,255,.2)', lineWidth: 1})
                    pageX = 1 - points[8].x
                    pageY = points[8].y
                } else {
                    pageX = 1 - points[9].x
                    pageY = points[9].y
                }
                handleEvents({type: 'handmove', pageX, pageY, isPointing}) //...I was going to capture the points[8].z and points[9].z respectively and call handleEvents from within the conditional block above with a further condition that considers the relative proximity to the camera of more than one hand favoring the closest but decided that it could stress out the model to track more than one hand
            }
        }
    },

    isPointing: points => { //utils.isPointing takes one argument, isPointing, and is called from utils.drawHand, which itself is called with each webcamRef.current.video frame (see annotations for utils.drawHand for explanation). The points argument passed is an array of objects, each containing x, y and z float point numbers, each which describe the relative position of 1 of 21 identifiable landmarks on the hand passed as { image: webcamRef.current.video } to hands.send from the useEffect in HandController. Hand landmarks are illustrated at    https://github.com/google-ai-edge/mediapipe/blob/master/docs/solutions/hands.md    . The logic in utils.isPointing uses those float point numbers to deduce whether or not the hand is in a pointing position and returns the corresponding boolean
        return (
            (((Math.abs(points[0].x - points[12].x) < Math.abs(points[0].x - points[9].x)) && (Math.abs(points[0].y - points[12].y) < Math.abs(points[0].y - points[9].y)))
            ||
            ((Math.abs(points[0].x - points[12].x) < Math.abs(points[0].x - points[10].x)) && (Math.abs(points[0].y - points[12].y) < Math.abs(points[0].y - points[10].y))))
            &&
            !(((Math.abs(points[0].x - points[8].x) < Math.abs(points[0].x - points[5].x)) && (Math.abs(points[0].y - points[8].y) < Math.abs(points[0].y - points[5].y)))
            ||
            ((Math.abs(points[0].x - points[8].x) < Math.abs(points[0].x - points[6].x)) && (Math.abs(points[0].y - points[8].y) < Math.abs(points[0].y - points[6].y))))
        )
    },

    getBoundingClientRectFloats: boundingClientRect => { //utils.getBoundingClientRectFloats takes one argument, boundingClientRect, which is an object representing the measured rectangular boundaries of the referenced element in question containing bottom, top, left and right boundaries as props, considers canvasHeight, canvasWidth and margin to calculate the respective float point values for these boundaries and returns them along with the original measured boundaries. It's called from utils.handHand which uses ReactDOM.findDOMNode to get the boundingClientRect from the referenced element passed to it
        const { bottom, top, left, right } = boundingClientRect

        return (
            {
                bottom, top, left, right,
                bottomFloat: boundingClientRect.bottom / canvasHeight,
                topFloat: boundingClientRect.top / canvasHeight,
                leftFloat: (boundingClientRect.left - margin) / canvasWidth,
                rightFloat: (boundingClientRect.right - margin) / canvasWidth
            }
        )
    },

    handleHand: (coords, ref, fn, rateLimit) => { //utils.handleHand takes four arguments, coords, ref, fn and rateLimit and calls fn at the specified rateLimit on the referenced element when the coords (from the tip of the pointing index finger) are within its boundaries. It's called from all components that are tracking the hand for this purpose, namely SocialMenu and AudioPlayer...
        const boundingClientRect = ReactDOM.findDOMNode(ref).getBoundingClientRect() //...get the four boundaries of the referenced element...

        let boundingClientRectFloats = utils.getBoundingClientRectFloats(boundingClientRect) //...and pass them to utils.getBoundingClientRectFloats to convert them to four floats...

        if (boundingClientRectFloats && coords.yCoordMoving > boundingClientRectFloats.topFloat && coords.yCoordMoving < boundingClientRectFloats.bottomFloat && coords.xCoordMoving > boundingClientRectFloats.leftFloat && coords.xCoordMoving < boundingClientRectFloats.rightFloat) { //...and if the tip of the pointing index finger, namely points[8] from utils.drawHand, is within the boundaries of the boundingClientRectFloats call fn at the specified rateLimit via utils.throttle because it would otherwise be called at the framerate of webcamRef.current.video in HandController
            utils.throttle(fn, rateLimit)
        }
    },

    simulateClickOrTouch: el => { //utils.simulateClickOrTouch takes a single argument, el, which is the DOM element on which the event will be simulated. Depending on the browser's capabilities the event simulated is either a TouchEvent or MouseEvent and configured to bubble up through the DOM and be cancellable, mimicking the behavior of a deliberate user triggered event. The procedure is called from utils.parseAndRenderPhotoData to work around the rigidity of react-photo-view's PhotoView component, instances of which are each given a src photo to appear in the PhotoProvider (carousel) as well as a thumbnail img child to be clicked on to open the PhotoProvider. This would be a great design but assumes that the hundreds of thumbnail img children are not in the download queue when one is clicked or touched to open the PhotoProvider. Realistically it can take 5 or more minutes for all the thumbnails to download so what ends up happening is the carousel opens to a blank screen for 5 or more minutes...
        const eventParams = { bubbles: true, cancelable: true } //...define common event parameters for both TouchEvent and MouseEvent to ensure the event bubbles up through the DOM and can be canceled...
        if (typeof window.TouchEvent !== 'undefined') { //...check if TouchEvent is supported by the browser...
            el.dispatchEvent(new TouchEvent('click', eventParams)) //...if so dispatch a new TouchEvent with 'click' type...
        } else {
            el.dispatchEvent(new MouseEvent('click', eventParams)) //...otherwise dispatch a new MouseEvent with 'click' type
        }
    },

    parseAndRenderPhotoData: (photoAlbum, setPhotoAlbum) => { //utils.parseAndRenderPhotoData takes two arguments, photoAlbum and setPhotoAlbum, which are the state and setState functions from TravelPhotos wherein it's called. If a photo album is open it returns a react-photo-view PhotoProvider component (carousel) with a PhotoView child for each of the photos in the specified album, otherwise it returns a page of divs displaying photo album titles and cover photos...

        if (photoAlbum.isPhotoProviderOpen) { //...if an album is open...
            const fullArray = photoData[photoAlbum.value].fullString.split(' ') //...create an array of urls of the hi res photos for that album...

            return ( //...and return a PhotoProvider component with PhotoView children for each of the photos in the album...
                <PhotoProvider
                    speed={() => 0} //...where speed is set to 0 so the carousel is quick...
                    loop={3} //...loop is 3 so the carousel looks ahead 3 images to download them...
                    pullClosable={false} //...pullClosable is false so the carousel can't be closed by pulling down because it tends to happen inadvertently when a user is swiping on mobile...
                    //maskOpacity={0.9} //...(this is a relic of my old implementation which had the issues caused by react-photo-view's rigidity as described in annotations to utils.simulateClickOrTouch)...
                    onVisibleChange={() => setPhotoAlbum({...photoAlbum, isPhotoProviderOpen: true})} //...onVisibleChange, called when PhotoProvider is visible (should more appropriately be called afterOpen), sets photoAlbum's isPhotoProviderOpen prop to true...
                    afterClose={() => setPhotoAlbum({...photoAlbum, isPhotoProviderOpen: false})} //...afterClose, called when PhotoProvider is closed, sets photoAlbum's isPhotoProviderOpen prop to false...
                    >
                    <div className='card-page'>
                        {
                            fullArray.map((i, index) => { //...and for each photo in the album give a PhotoView to the PhotoProvider (carousel) to handle as well as a dummy thumbnail child, the first of which automatically opens the PhotoProvider onLoad using utils.simulateClickOrTouch...
                                return (
                                    <PhotoView src={i} alt='' key={index} >
                                        <img src={dummyImage} alt='' loading='lazy'
                                            onLoad={(e) => {
                                                if (index === 0) {
                                                    utils.simulateClickOrTouch(e.target)
                                                }
                                            }}
                                        />
                                    </PhotoView>
                                )
                            })
                        }
                    </div>
                </PhotoProvider>
            )
        } else { //...otherwise if no album is open...
            return ( //...return a page of lazy loading divs displaying photo album titles and their associated cover photos from photoData which when clicked set photoAlbum's value prop to the index of the desired photo album and it's isPhotoProviderOpen prop to true
                <div className='card-page'>
                    {
                        photoData.map((i, index) => {
                            return (
                                <div key={index} className='album-container'>
                                    <h2 className='album-name'>{i.albumName.substring(16)}</h2>
                                    <img src={i.albumCover} className='album-cover' onClick={() => setPhotoAlbum({value: index, isPhotoProviderOpen: true})} alt='' loading='lazy'/>
                                </div>
                            )
                        })
                    }
                </div>
            );
        }
    }

}

export default utils
