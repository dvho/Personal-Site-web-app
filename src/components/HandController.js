//Thanks to    https://github.com/syed-ashraf123/mediapipe_face_mesh    for demonstrating MediaPipe integration with React, not just VanillaJS

import React, { useEffect, useCallback, useRef } from 'react'
import * as Hands from '@mediapipe/hands'
import * as cam from '@mediapipe/camera_utils'
import Webcam from 'react-webcam'

import config from '../_config'
import utils from '../_utils'

const { screenWidth, canvasHeight, canvasWidth, wideScreen } = config.constants
const { drawHand } = utils

const HandController = ({ handleEvents }) => {
    //I'm using useRef instead of the callback ref pattern    ref={ref => <refName> = ref}    for performance purposes. Refs with useRef return a mutable ref object whose .current property is initialized to the argument passed to it, in this case, null. The returned object will persist for the full lifetime of the component providing a consistent way to access the refs. The callback ref pattern on the other hand will be called more than once during updates, as it gets called first with null and then again with the DOM element each time the component rerenders. useRef however doesn't cause a rerender when the ref object is mutated, which is beneficial for performance when you need to frequently update the ref without needing to update the component visually. The callback ref pattern might lead to performance hits if not managed carefully especially if the ref callback triggers rerenders or is tied to high-frequency events
    const webcamRef = useRef(null)
    const canvasRef = useRef(null)

    const onResults = useCallback(results => { //React warnings suggested placing onResults in the dependency array of the useEffect    "React Hook useEffect has a missing dependency: 'onResults'. Either include it or remove the dependency array"    and upon doing so  warns    "The 'onResults' function makes the dependencies of useEffect Hook (at line 57) change on every render. Move it inside the useEffect callback. Alternatively, wrap the definition of 'onResults' in its own useCallback() Hook"    . Doing so gives the warning    "React Hook useCallback has a missing dependency: 'props.handleEvents'. Either include it or remove the dependency array"    . When Home.js was a class component I had props.handleEvents in the dependency array but and the result was a much smoother animation of the hand but after changing Home.js to a function component it crashed the app with    "Uncaught runtime errors: × ERROR Aborted(Module.arguments has been replaced with plain arguments_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)) RuntimeError: Aborted(Module.arguments has been replaced with plain arguments_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)) at abort (https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands_solution_simd_wasm_bin.js:9:17640) at Object.get (https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands_solution_simd_wasm_bin.js:9:7759) at https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands_solution_simd_wasm_bin.js:9:5881 at ra.i (http://localhost:3000/static/js/bundle.js:8237:138) at ua (http://localhost:3000/static/js/bundle.js:6460:17) at va.next (http://localhost:3000/static/js/bundle.js:6486:64) at http://localhost:3000/static/js/bundle.js:6512:11 at new Promise () at wa (http://localhost:3000/static/js/bundle.js:6508:12) at E (http://localhost:3000/static/js/bundle.js:6516:12)"
        const { videoWidth, videoHeight } = webcamRef.current.video

        canvasRef.current.width = videoWidth
        canvasRef.current.height = videoHeight

        const canvasElement = canvasRef.current
        const canvasCtx = canvasElement.getContext('2d')
        canvasCtx.save()
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)

        drawHand(canvasCtx, results, handleEvents)

        canvasCtx.restore()
    }, [])

    useEffect(() => {

        const hands = new Hands.Hands({
            locateFile: file => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` // MediaPipe documentation only demonstrates locating files hosted on their cdn, i.e.    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`    as explained at    https://google.github.io/mediapipe/solutions/hands#javascript-solution-api    , for this API as well as all their others. But   @mediapipe/hands    is installed in this project and all these files are right here in    node_modules    so why can't we use the files locally instead of relying on mediapipe's cdn? If you were to reference these files in    node_modules    like    return `../node_modules/@mediapipe/hands/{file}`    at first glance that might seem as if it should work but these files aren't being referenced from here, they're being referenced from the    public    folder. So copying all the needed files from    node_modules/@mediapipe/hands    to the    public    folder per    https://github.com/google/mediapipe/issues/1812#issuecomment-846459141    works but a few tweaks should be in order: When you run    npm run build    , Create React App will substitute    %PUBLIC_URL%    with a correct absolute path so your project works even if you use client-side routing or host it at a non-root URL. In JavaScript code, you can use    process.env.PUBLIC_URL    for similar purposes per    https://create-react-app.dev/docs/using-the-public-folder/#:~:text=Only%20files%20inside%20the%20public,a%20part%20of%20the%20build.    Also, instead of hardcoding these files a single time, I wanted them to update dynamically when I ran my react start and build scripts. The solution was to add an empty    hands    folder to public and write my    _postinstall.js    script and run it after start and build, inspired by    https://stackoverflow.com/questions/45784650/reference-folder-in-node-modules-from-index-html-create-react-app    then add the    public/hands    folder to    .gitignore    to prevent the addition of over 25mb of bloat that would otherwise compound with every commit. The script gets an array of filenames from    node_modules/@mediapipe/hands    per the answer at    https://stackoverflow.com/questions/32511789/looping-through-files-in-a-folder-node-js    under "Synchronously" by ma11hew28 on 2019, 11-26th, then runs a "copyFile" function which simply copies each file to    public/hands    . This solution worked but a) As I went through the above process I was in the    public    folder looking at    public/index.html    recalling that the project already has cdn dependant content from FontAwesome and Ionicons, so there was no reason to be pious about keeping all files local to the project, and b) though changing my    npm run start    script to    react-scripts start & node _postinstall.js    had the desired effect, terminating the start script no long worked so I had to    npx kill-port 3000    to stop the dev server on port 3000. Eventually I settled to go back to square one, moving    _postinstall.js    to    assets-in-progress    for future reference    , reverting my start and build scripts in    package.json    to their defaults, commenting out    `${process.env.PUBLIC_URL}/hands/${file}`    which I was originally so excited about, deleting the contents of    public/hands   though leaving the folder there as a souvenir as well as leaving the reference to it in    .gitignore    , and following the MediaPipe docs with    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
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
                    try {
                        await hands.send({ image: webcamRef.current.video })
                    } catch (err) {
                        console.error(err)
                    }
                }
            })
            camera.start()
        }

    }, [onResults])

    return (
        <div className={'hand-controller'}>

            <Webcam ref={webcamRef} style={{display: 'none'}} imageSmoothing={false}/>

            <canvas ref={canvasRef} style={{position: 'absolute', marginLeft: 'auto', marginRight: 'auto', left: wideScreen ? 0 : (screenWidth - canvasWidth) / 2, right: 0, zIndex: 10000, width: canvasWidth, height: canvasHeight}} />

        </div>
    )
}


export default HandController
