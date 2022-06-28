//Thanks to    https://github.com/syed-ashraf123/mediapipe_face_mesh    for demonstrating MediaPipe integration with React, not just VanillaJS

import React, { useRef, useEffect, useCallback } from 'react'
import * as Hands from '@mediapipe/hands'
import * as cam from '@mediapipe/camera_utils'
import Webcam from 'react-webcam'

import { handControllerUtils } from './handControllerUtils'

const HandController = props => {

    const webcamRef = useRef(null)
    const canvasRef = useRef(null)

    const onResults = useCallback(results => { //React warnings suggested placing onResults in the dependency array of the useEffect    "React Hook useEffect has a missing dependency: 'onResults'. Either include it or remove the dependency array"    and upon doing so  warns    "The 'onResults' function makes the dependencies of useEffect Hook (at line 57) change on every render. Move it inside the useEffect callback. Alternatively, wrap the definition of 'onResults' in its own useCallback() Hook"    . Wrapping onResults in a useCallback requires props.calcAllDimensionsCoordsAndResetClouds in its dependency array per    "React Hook useCallback has a missing dependency: 'props.calcAllDimensionsCoordsAndResetClouds'. Either include it or remove the dependency array"    and the end result to honoring these warning is a much smoother animation of the hand
        const { videoWidth, videoHeight } = webcamRef.current.video

        canvasRef.current.width = videoWidth
        canvasRef.current.height = videoHeight

        const canvasElement = canvasRef.current
        const canvasCtx = canvasElement.getContext('2d')
        canvasCtx.save()
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)

        handControllerUtils.drawHand(canvasCtx, results, props.calcAllDimensionsCoordsAndResetClouds)

        canvasCtx.restore()
    }, [props.calcAllDimensionsCoordsAndResetClouds])

    useEffect(() => {

        const hands = new Hands.Hands({
            locateFile: file => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` // MediaPipe documentation only demonstrates locating files hosted on their cdn, i.e.    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`    as explained at    https://google.github.io/mediapipe/solutions/hands#javascript-solution-api    , for this API as well as all their others. But   @mediapipe/hands    is installed in this project and all these files are right here in    node_modules    so why can't we use the files locally instead of relying on mediapipe's cdn? If you were to reference these files in    node_modules    like    return `../node_modules/@mediapipe/hands/{file}`    at first glance that might seem as if it should work but these files aren't being referenced from here, they're being referened from the    public    folder. So copying all the needed files from    node_modules/@mediapipe/hands    to the    public    folder per    https://github.com/google/mediapipe/issues/1812#issuecomment-846459141    works but a few tweaks should be in order: When you run    npm run build    , Create React App will substitute    %PUBLIC_URL%    with a correct absolute path so your project works even if you use client-side routing or host it at a non-root URL. In JavaScript code, you can use    process.env.PUBLIC_URL    for similar purposes per    https://create-react-app.dev/docs/using-the-public-folder/#:~:text=Only%20files%20inside%20the%20public,a%20part%20of%20the%20build.    Also, instead of hardcoding these files a single time, I wanted them to update dynamically when I ran my react start and build scripts. The solution was to add an empty    hands    folder to public and write my    _postinstall.js    script and run it after start and build, inspired by    https://stackoverflow.com/questions/45784650/reference-folder-in-node-modules-from-index-html-create-react-app    then add the    public/hands    folder to    .gitignore    to prevent the addition of over 25mb of bloat that would otherwise compound with every commit. The script gets an array of filenames from    node_modules/@mediapipe/hands    per the answer at    https://stackoverflow.com/questions/32511789/looping-through-files-in-a-folder-node-js    under "Synchronously" by ma11hew28 on 2019, 11-26th, then runs a "copyFile" functiom which simply copies each file to    public/hands    . This solution worked but a) As I went through the above process I was in the    public    folder looking at    public/index.html    recalling that the project already has cdn dependant content from FontAwesome and Ionicons, so there was no reason to be pious about keeping all files local to the project, and b) though changing my    npm run start    script to    react-scripts start & node _postinstall.js    had the desired effect, terminating the start script no long worked so I had to    npx kill-port 3000    to stop the dev server on port 3000. Eventually I settled to go back to square one, moving    _postinstall.js    to    assets-in-progress    for future reference    , reverting my start and build scripts in    package.json    to their defaults, commenting out    `${process.env.PUBLIC_URL}/hands/${file}`    which I was originally so excited about, deleting the contents of    public/hands   though leaving the folder there as a souvenier as well as leaving the reference to it in    .gitignore    , and following the MediaPipe docs with    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
            }
        })

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 0, //https://google.github.io/mediapipe/solutions/hands.html#model_complexity
            minDetectionConfidence: 0.4,
            minTrackingConfidence: 0.4
        })

        hands.onResults(onResults)

        if (typeof webcamRef.current !== 'undefined' && webcamRef.current !== null) {
            let camera = new cam.Camera(webcamRef.current.video, {
                onFrame: async () => {
                    await hands.send({ image: webcamRef.current.video })
                }
            })
            camera.start()
        }

    }, [onResults])

    return (
        <div className={'hand-controller'}>

            <Webcam ref={webcamRef} style={{display: 'none'}} imageSmoothing={false}/>

            <canvas ref={canvasRef} style={{position: 'absolute', marginLeft: 'auto', marginRight: 'auto', left: props.wideScreen ? 0 : (props.screenWidth - props.canvasWidth) / 2, right: 0, zIndex: 10000, width: props.canvasWidth, height: props.canvasHeight}} />

        </div>
    )
}


export default React.memo(HandController)
