import * as Hands from '@mediapipe/hands'
import * as drawingUtils from '@mediapipe/drawing_utils'
import ReactDOM from 'react-dom'

import config from '../_config'
import utils from '../_utils'

const { canvasHeight, canvasWidth, margin } = config.constants

export const handControllerUtils = {

    isPointing: points => { //Calculates if either the tip of your middle finger is closer to your wrist than the base of your middle finger and if the tip of your middle finger is closer to your wrist than the middle knuckle of your middle finger, for which if at least one is true quite accurately indicates that the hand is in a fist, then calculates if the opposite is true for your index finger, which indicates that the user is deliberately pointing their finger
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

    drawHand: (canvasCtx, results, handleEvents) => { //Hand landmarks are illustrated here    https://google.github.io/mediapipe/images/mobile/hand_landmarks.png

        if (results.multiHandLandmarks) {

            const connect = drawingUtils.drawConnectors
            const landmark = drawingUtils.drawLandmarks

            for (const landmarks of results.multiHandLandmarks) {
                const points = results.multiHandLandmarks[0]
                const isPointing = handControllerUtils.isPointing(points)
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
                handleEvents({type: 'handmove', pageX, pageY, isPointing}) //In the case of more than one hand, was going to conditionally fire this function based on which result had the closest multiHandLandmarks[i][9] value but it looks cool when Face.js gets confused
            }
        }
    },

    getBoundingClientRectCoords: (boundingClientRect, totalWidth, totalHeight, marginLeft) => { //To use this    handControllerUtils.getBoundingClientRectCoords    function, from the importing component    import ReactDOM from 'react-dom'   then from useEffect or equivalent call    handControllerUtils.getBoundingClientRectCoords(ReactDOM.findDOMNode(this).getBoundingClientRect())

        const { bottom, top, left, right } = boundingClientRect

        return (
            {
                bottom, top, left, right,
                bottomFloat: boundingClientRect.bottom / totalHeight,
                topFloat: boundingClientRect.top / totalHeight,
                leftFloat: (boundingClientRect.left - marginLeft) / totalWidth,
                rightFloat: (boundingClientRect.right - marginLeft) / totalWidth
            }
        )
    },

    handleHand: (isPointing, coords, ref, fn, rateLimit) => { //The rateLimit argument is passed to utils.throttle and is imperative because once props.isPointing is true the operations in handleHand would otherwise be called at the framerate of the webcam in HandController
        if (isPointing) {
            const boundingClientRect = ReactDOM.findDOMNode(ref).getBoundingClientRect()

            let componentCoords = handControllerUtils.getBoundingClientRectCoords(boundingClientRect, canvasWidth, canvasHeight, margin)

            if (componentCoords && coords.yCoordMoving > componentCoords.topFloat && coords.yCoordMoving < componentCoords.bottomFloat && coords.xCoordMoving > componentCoords.leftFloat && coords.xCoordMoving < componentCoords.rightFloat) {
                utils.throttle(fn, rateLimit)
            }
        }
    }

}
