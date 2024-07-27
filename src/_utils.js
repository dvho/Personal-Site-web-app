import * as Hands from '@mediapipe/hands'
import * as drawingUtils from '@mediapipe/drawing_utils'
import { findDOMNode } from 'react-dom'
import emailjs from '@emailjs/browser' //https://github.com/emailjs-com/emailjs-sdk    https://www.emailjs.com/docs/sdk/send/
import { PhotoProvider, PhotoView } from 'react-photo-view' //https://react-photo-view.vercel.app/en-US/docs/getting-started

import config from './_config'
import { photoData } from './assets/data'


const { appFont } = config
const { canvasHeight, canvasWidth, screenWidth, wideScreen, moonDiameter, margin, aspectRatio, blinkFrameDelays } = config.constants
const { dummyImage, eyePosition, eyePosition: { faceEmpty, faceEyePosition1L1, faceEyePosition1L2, faceEyePosition1L3, faceEyePosition1R1, faceEyePosition1R2, faceEyePosition1R3, faceEyePosition1R4, faceEyePosition2L1, faceEyePosition2L2, faceEyePosition2L3, faceEyePosition2L4, faceEyePosition2R2, faceEyePosition2R3, faceEyePosition2R4, faceEyePosition3L1, faceEyePosition3L2, faceEyePosition3L3, faceEyePosition3R1, faceEyePosition3R2, faceEyePosition3R3, faceEyePosition4L1, faceEyePosition4L2, faceEyePosition4L3, faceEyePosition4L4, faceEyePosition4R1, faceEyePosition4R2, faceEyePosition4R3, faceEyePosition4R4, faceEyePosition5L1, faceEyePosition5L2, faceEyePosition5L3, faceEyePosition5L4, faceEyePosition5L5, faceEyePosition5R1, faceEyePosition5R2, faceEyePosition5R3, faceEyePosition5R4 }, blink: { faceBlinkA, faceBlinkB, faceBlinkC, faceBlinkD, faceBlinkE, faceBlinkF } } = config.images


const utils = {
//TODO: https://www.npmjs.com/package/onhold
    onHold: (() => { //The function returned by this onHold IIFE is actually the one being called, hence, calling utils.onHold(fn, latency, e) works even though onHold appears to take no parameters. It's structure as an IIFE's is to set up the closure scope for holdTimer outside of the returned function, ensuring that it's private and persistent across multiple calls to utils.onHold, so the three arguments it takes are: A function to call on hold, a latency to determine hold duration and an event to check its type...
        let holdTimer = null //...declare holdTimer inside the closure scope of onHold so that it persists across multiple calls to utils.onHold and initialize it to null...

        const onEvents = ['mouseenter', 'keydown', 'mousedown', 'touchstart', 'pointerdown', 'dragstart'] //...define the events that trigger the onHold function...
        const offEvents = ['mouseleave', 'keyup', 'mouseup', 'touchend', 'pointerup', 'dragend'] //...and the events that stop it...

        return (fn, latency, e) => { //...return the actual onHold function...
            //...(and because the default is onClick don't call e.preventDefault() here)...
            const upListener = () => { //...in which a listener is defined for the mouseleave, keyup, mouseup and touchend events...
                clearTimeout(holdTimer) //...where if a the mouse leaves, or a key, the mouse button or a touch is released it clears the holdTimer...
                offEvents.forEach(i =>
                    e.target.removeEventListener(i, upListener)) //...and removes the listeners for mouseleave, keyup, mouseup and touchend...
            }

            if (onEvents.includes(e.type)) { //...and if the event is a mouseenter, keydown, mousedown or touchstart...
                offEvents.forEach(i =>
                    e.target.addEventListener(i, upListener)) //...add the mouseleave, keyup, mouseup and touchend listeners to the target of the event...

                holdTimer = setTimeout(() => { //...set holdTimer to a setTimeout which calls the specified function after the specified latency...
                    fn() // ...wherein the function is called...
                    upListener() //...and the upListener used to clean up...
                }, latency)
            } else if (offEvents.includes(e.type)) { //...otherwise if the event is a mouseleave, keyup, mouseup or touchend...
                upListener() //...directly call upListener to clean up
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
//TODO: https://www.npmjs.com/package/value
    isEmailValid: email => { //utils.isEmailValid takes one argument, an email address, and returns a boolean indicating whether or not its format is valid...

        if (typeof email !== 'string') { return false } //...according to RFC 5321 and before anything check to make sure what ended up being passed to the procedure was actually a string...

        email = email.trim() //...remove any whitespace that might have ended up in it...
        if (email.length > 254) { return false } //...according to the RFC 5321 specification for maximum allowed email length, check if the string is longer than 254 characters...
        const structure = /^[^@]+@[^@]+\.[^@]+$/ //...define a regex to check if a string starts with one or more characters that are not an @ followed by an @, followed by one or more characters that are not an @ followed by a period and finally ending in one or more characters that are not an @ which, for the sake of practical validation, simplifies the structure defined by the RFC 5322 specification...
        const handle = /^(?:[\p{L}\p{N}_+=&](?:[\p{L}\p{N}_+=&]|(?:\.(?!\.)))*[\p{L}\p{N}_+=&]|[\p{L}\p{N}_+=&])$/u; //...according to the RFC 5321 specification define a regex to check if a string contains only valid characters including equals and ampersand for use in the handle of an email, and ensure that it doesn't have contiguous periods or a period at the beginning, ends with a letter, number, underscore, plus sign, equals sign, or ampersand according to the RFC 5321 specification...
        const domain = /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/ //...according to the RFC 1035 specification define a regex to check if a string contains only valid characters for use in the domain of an email and inherently doesn't have contiguous periods, doesn't have contiguous hyphens and doesn't start or end with a hyphen...
        const ipV4DomainLiteral = /^\[((25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)\.){3}(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)\]$/ //...according to section 4.1.2 of the RFC 5321 specification define a regex to check if a string is a valid IPv4 domain literal address...
        const ipV6DomainLiteral = /^\[(IPv6:)?[0-9a-fA-F:]+\]$/ //...according to the RFC 4291 specification define a regex to check if a string is a valid IPv6 domain literal address...
        const quotedString = /^"([\s\S]+)"$/ //...according to the RFC 5322 specification define a regex to check if any quoted strings, though rare in email addresses, are valid...

        const [handlePortion, domainPortion] = [email.slice(0, email.lastIndexOf('@')), email.slice(email.lastIndexOf('@') + 1)] //...split the email address into two portions, the handle portion and the domain portion, at the last occurrence of the @ symbol...

        if ((domainPortion.startsWith('[') && domainPortion.endsWith(']')) || (handlePortion.startsWith('"') && handlePortion.endsWith('"'))) { //...if the domain of the email is a domain literal, permitted under the RFC 1035 specification, or if the handle of the email is a quoted string, permitted under the RFC 5322 specification...

            if (domainPortion.startsWith('[') && domainPortion.endsWith(']')) { //...if the former...

                if (!ipV4DomainLiteral.test(domainPortion) && !ipV6DomainLiteral.test(domainPortion)) { //...if it's not a valid IPv4 or IPv6 domain literal...
                    return false //...return false...
                }
            }

            if (handlePortion.startsWith('"') && handlePortion.endsWith('"')) { //...and if the latter...

                if (!quotedString.test(handlePortion)) { //...if it's not a valid quoted string...
                    return false //...return false...
                }
            }

        } else if (!structure.test(email) || !handle.test(handlePortion) || !domain.test(domainPortion)) { return false } //...otherwise if the email address doesn't pass the structure regex, or the handle doesn't pass the handle regex, or the domain doesn't pass the domain regex, return false...

        return true //...otherwise return true
    },

    isNameValid: name => { //utils.isNameValid takes one argument, a name, and returns a boolean indicating whether or not its format is valid...

        if (typeof name !== 'string') { return false } //...make sure what ended up being passed to the procedure was actually a string...

        name = name.trim() //...remove any whitespace that might have ended up in it...

        if (name.length > 64) { return false } //...there's no RFC specification for maximum allowed name length but set it to 64 anyway...

        const validNameRegex = /^[A-Z]+$/i //...define a regex to check if there is at least one letter and no non letter characters in the string...

        return validNameRegex.test(name) //...and return the result of testing the name against the regex
    },

    updateContactForm: (e, type, form, setForm) => { //utils.updateContactForm takes four arguments, an event, a type, the form object and the setForm function, and is called from the onChange event of the input fields in Contact.js where each field updates a designated property of the form object according to the type passed with the value of that input field as it's being typed in
        setForm({ ...form, [type]: e.target.value })
    },

    submitContactForm: async (e, dispatch, form, setForm) => { //utils.submitContactForm takes four arguments, an event, the reducer's dispatch function in Home.js, the form object and the setForm function, and is called from the onSubmit event of the form in Contact.js where the form is first validated and then sent via @emailjs/browser's send method...

        e.preventDefault() //...prevent the default form submission behavior...

        const initialState = config.initialStates.contactForm //...initialize the form to its initial state, the object for which is set from config.initialStates...

        const { isNameValid, isEmailValid } = utils //...destructure the two validation functions from here in utils...

        let firstNameValid = isNameValid(form.firstName) //...validate the first name...
        let lastNameValid = isNameValid(form.lastName) //...validate the last name...
        let emailValid = isEmailValid(form.email) //...validate the email...

        if (firstNameValid && lastNameValid && emailValid) { //...and if all three of those fields are valid...

            let templateParams = { //...set up the templateParams object with the form fields...
                from_email: form.email,
                from_firstName: form.firstName,
                from_lastName: form.lastName,
                subject: form.subject,
                message_html: form.message
            }

            try { //...try to send the email...
                const response = await emailjs.send('service_j0tuddh', 'template_XwZav7A3', templateParams, 'user_cqWwBjugzaX0BXZjXbz8a') //...note, @emailjs/browser' send method used to work like    window.emailjs.send('gmail', 'template_XwZav7A3', templateParams, 'user_cqWwBjugzaX0BXZjXbz8a')    and the associated EmailJS account had to be linked in the head of index.html...
                console.log('SUCCESS!', response.status, response.text)
            } catch (err) { //...and if it fails...
                console.log('FAILED...', err) //...log the error...
            }

            setForm({ //...but otherwise set formSent to true while once again nulling the validity of the values that needed validating...
                ...form,
                formSent: true,
                firstNameValid: null,
                lastNameValid: null,
                emailValid: null
            })
            setTimeout(() => { //...and wait 2500ms for either the form-send-wide-animation or the form-send-narrow-animation CSS animation to run...
                setForm(initialState) //...before resetting the form to its initialState...
                dispatch({type: 'toggleContactForm'}) //...and hiding it using its state of visibility which is managed in Home.js...
            }, 2500)

        } else { //...otherwise if not all three of the tested fields are valid simply set the states of their currently validities so that utils.getStylesClassNamesAndRenderingVariablesForContactForm can display their styles accordingly to let the user know which field is or which fields are still invalid so they can keep trying
            setForm({
                ...form,
                firstNameValid,
                lastNameValid,
                emailValid
            })
        }
    },

    fluctuateVeilOpacity: (dispatch, travelDuration, cloudWidth) => { //utils.fluctuateVeilOpacity takes three arguments, access to the reducer's dispatch function in Home.js, the travelDuration of the cloud in seconds and the cloudWidth...

        const cloudIn = travelDuration * 1000 / 3 //...the cloud's travel trajectory is the full width of the view port, i.e. translateX(-100vw) through translateX(100vw), or translateX(100vw) through translateX(-100vw) in the case of the cloud icon being flipped (see App.css for those @keyframes), and taking into account the average cloudWidth of a generated cloud, which is calculated in Cloud.js as a function of canvasHeight, the approximate moment in ms the cloud enters in front of the moon is its travelDuration in seconds times 1000 divided by 3...
        const cloudOut = cloudIn + ((cloudWidth * travelDuration * 1000 / 300) / (screenWidth / moonDiameter)) //...and the approximate moment the it leaves the field of the moon in ms is a function of its cloudWidth times its travelDuration in seconds times 1000 divided by about what happens to be about 300 plus the amount of time in ms it took for the cloud to begin crossing the moon, all divided by the screenWidth and again by the moonDiameter...

        setTimeout(() => dispatch({type: 'veilOpacity', veilOpacity: .15}), cloudIn) //...use cloudIn ms to time dimming the veilOpacity by .15...
        setTimeout(() => dispatch({type: 'veilOpacity', veilOpacity: -.15}), cloudOut) //...and use cloudOut ms to time un-dimming the veilOpacity by .15...
        //...this veilOpacity state in Home.js is the prop used in Veil.js create the effect of the moon's light being obscured incrementally by clouds
    },

    blink: (dispatch, currentFaceFrame) => { //utils.blink takes two arguments, access to the reducer's dispatch function in Home.js and the currentFaceFrame at the moment it's called...

        const randomBlinkDuration = 100 + Math.random() * 150 //...set a randomBlinkDuration between 100ms and 250ms...

        dispatch({type: 'isBlinking', isBlinking: true}) //...dispatch isBlinking as true so that it can be used as a condition to prevent utils.changeEyePositionWithUserInteraction from being called from handleEvents in Home.js while the blinking is in progress, so as not to interrupt the blink...

        dispatch({type: 'faceFrame', faceFrame: faceEmpty}) //...initialize the blink with config.images.eyePosition.faceEmpty (which reveals eyes facing forward) and necessarily remain at this position for a length of time equal to randomBlinkDuration * config.constants.blinkFrameDelays[0], which is when the blink sequence begins...

        //...follow with a sequence of 10 setTimeouts that dictate the blink sequence and run at randomBlinkDuration * config.constants.blinkFrameDelays[<index>] (where config.constants.blinkFrameDelays[9] is 1.1, not 1, so the last frame, which becomes either whatever was passed as faceFrame or whatever is returned from utils.changeEyePositionWithUserInteraction, could run at a max setTimeout of 600 + 250 * 1.1 = 875ms, which is still always sufficiently less than the repeatRate set forth in blinkControl in Home.js. Note, setTimeouts are run for frames from D to A, then back up to F. I would have included two earlier indices in constants.blinkFrameDelays, .02 and .05 for an earlier frame F and frame E, respectively, to come at the very beginning of the sequence but discovered that the blink looked more natural when the eyes moved rapidly to the closed position and then dragged a little more on the way up, and omitting those two frames F and E at the beginning depicted this much better...
        setTimeout(() => dispatch({type: 'faceFrame', faceFrame: faceBlinkD}), randomBlinkDuration * blinkFrameDelays[0])
        setTimeout(() => dispatch({type: 'faceFrame', faceFrame: faceBlinkC}), randomBlinkDuration * blinkFrameDelays[1])
        setTimeout(() => dispatch({type: 'faceFrame', faceFrame: faceBlinkB}), randomBlinkDuration * blinkFrameDelays[2])
        setTimeout(() => dispatch({type: 'faceFrame', faceFrame: faceBlinkA}), randomBlinkDuration * blinkFrameDelays[3])
        setTimeout(() => dispatch({type: 'faceFrame', faceFrame: faceBlinkB}), randomBlinkDuration * blinkFrameDelays[4])
        setTimeout(() => dispatch({type: 'faceFrame', faceFrame: faceBlinkC}), randomBlinkDuration * blinkFrameDelays[5])
        setTimeout(() => dispatch({type: 'faceFrame', faceFrame: faceBlinkD}), randomBlinkDuration * blinkFrameDelays[6])
        setTimeout(() => dispatch({type: 'faceFrame', faceFrame: faceBlinkE}), randomBlinkDuration * blinkFrameDelays[7])
        setTimeout(() => dispatch({type: 'faceFrame', faceFrame: faceBlinkF}), randomBlinkDuration * blinkFrameDelays[8])
        setTimeout(() => {
            dispatch({type: 'faceFrame', faceFrame: currentFaceFrame})
            dispatch({type: 'isBlinking', isBlinking: false})
        }, randomBlinkDuration * blinkFrameDelays[9]) //...finally set faceFrame back to whatever it was before the blink sequence began and set isBlinking back to false so that utils.changeEyePositionWithUserInteraction can once again be called from handleEvents in Home.js
    },

    changeEyePositionWithUserInteraction: (dispatch, coords) => { //utils.changeEyePositionWithUserInteraction takes two arguments. Access to the reducer's dispatch function in Home.js and an object of coords passed to it (which are simply xCoordMoving and yCoordMoving)...

        const { xCoordMoving, yCoordMoving } = coords //...destructure the object of coords into xCoordMoving and yCoordMoving...

        let position //...declare a position...

        //...define position depending on where xCoordMoving and yCoordMoving are...
        switch (true) {
            case yCoordMoving >= 0 && yCoordMoving < .2:
                switch (true) {
                    case xCoordMoving < .25: position = faceEyePosition1R4; /* console.log('Block-01  Position-1R4'); */ break
                    case xCoordMoving < .35: position = faceEyePosition1R3; /* console.log('Block-01  Position-1R3'); */ break
                    case xCoordMoving < .40: position = faceEyePosition1R2; /* console.log('Block-01  Position-1R2'); */ break
                    case xCoordMoving < .50: position = faceEyePosition1R1; /* console.log('Block-01  Position-1R1'); */ break
                    case xCoordMoving < .58: position = faceEyePosition1L1; /* console.log('Block-01  Position-1L1'); */ break
                    case xCoordMoving < .70: position = faceEyePosition1L2; /* console.log('Block-01  Position-1L2'); */ break
                    default: position = faceEyePosition1L3; /* console.log('Block-01  Position-1L3  (default)'); */ break
                }
                break

            case yCoordMoving >= .2 && yCoordMoving < .4:
                switch (true) {
                    case xCoordMoving < .35: position = faceEyePosition2R4; /* console.log('Block-02  Position-2R4'); */ break
                    case xCoordMoving < .40: position = faceEyePosition2R3; /* console.log('Block-02  Position-2R3'); */ break
                    case xCoordMoving < .50: position = faceEyePosition2R2; /* console.log('Block-02  Position-2R2'); */ break
                    case xCoordMoving < .55: position = faceEyePosition2L1; /* console.log('Block-02  Position-2L1'); */ break
                    case xCoordMoving < .70: position = faceEyePosition2L2; /* console.log('Block-02  Position-2L2'); */ break
                    case xCoordMoving < .85: position = faceEyePosition2L3; /* console.log('Block-02  Position-2L3'); */ break
                    default: position = faceEyePosition2L4; /* console.log('Block-02  Position-2L4  (default)'); */ break
                }
                break

            case yCoordMoving >= .4 && yCoordMoving < .45:
                switch (true) {
                    case xCoordMoving < .3: position = faceEyePosition2R4; /* console.log('Block-03  Position-2R4'); */ break
                    case xCoordMoving < .4: position = faceEyePosition3R3; /* console.log('Block-03  Position-3R3'); */ break
                    case xCoordMoving < .45: position = faceEyePosition3R2; /* console.log('Block-03  Position-3R2'); */ break
                    case xCoordMoving < .5: position = faceEyePosition3R1; /* console.log('Block-03  Position-3R1'); */ break
                    case xCoordMoving < .55: position = faceEmpty; /* console.log('Block-03  Position-EMPTY'); */ break
                    case xCoordMoving < .625: position = faceEyePosition3L1; /* console.log('Block-03  Position-3L1'); */ break
                    case xCoordMoving < .65: position = faceEyePosition3L2; /* console.log('Block-03  Position-3L2'); */ break
                    case xCoordMoving < .7: position = faceEyePosition3L3; /* console.log('Block-03  Position-3L3'); */ break
                    default: position = faceEyePosition4L4; /* console.log('Block-03  Position-4L4  (default)'); */ break
                }
                break

            case yCoordMoving >= .45 && yCoordMoving < .5:
                switch (true) {
                    case xCoordMoving < .2: position = faceEyePosition4R4; /* console.log('Block-04  Position-4R4'); */ break
                    case xCoordMoving < .40: position = faceEyePosition4R3; /* console.log('Block-04  Position-4R3'); */ break
                    case xCoordMoving < .45: position = faceEyePosition4R2; /* console.log('Block-04  Position-4R2'); */ break
                    case xCoordMoving < .55: position = faceEyePosition4R1; /* console.log('Block-04  Position-4R1'); */ break
                    case xCoordMoving < .60: position = faceEyePosition4L1; /* console.log('Block-04  Position-4L1'); */ break
                    case xCoordMoving < .70: position = faceEyePosition4L2; /* console.log('Block-04  Position-4L2'); */ break
                    case xCoordMoving < .775: position = faceEyePosition4L3; /* console.log('Block-04  Position-4L3'); */ break
                    case xCoordMoving < .85: position = faceEyePosition4L4; /* console.log('Block-04  Position-4L4'); */ break
                    default: position = faceEyePosition5L5; /* console.log('Block-04  Position-5L5  (default)'); */ break
                }
                break

            case yCoordMoving >= .5:
                switch (true) {
                    case xCoordMoving < .15: position = faceEyePosition5R4; /* console.log('Block-05  Position-5R4'); */ break
                    case xCoordMoving < .30: position = faceEyePosition5R3; /* console.log('Block-05  Position-5R3'); */ break
                    case xCoordMoving < .45: position = faceEyePosition5R2; /* console.log('Block-05  Position-5R2'); */ break
                    case xCoordMoving < .55: position = faceEyePosition5R1; /* console.log('Block-05  Position-5R1'); */ break
                    case xCoordMoving < .625: position = faceEyePosition5L1; /* console.log('Block-05  Position-5L1'); */ break
                    case xCoordMoving < .70: position = faceEyePosition5L2; /* console.log('Block-05  Position-5L2'); */ break
                    case xCoordMoving < .775: position = faceEyePosition5L3; /* console.log('Block-05  Position-5L3'); */ break
                    case xCoordMoving < .85: position = faceEyePosition5L4; /* console.log('Block-05  Position-5L4'); */ break
                    default: position = faceEyePosition5L5; /* console.log('Block-05  Position-5L5  (default)'); */ break
                }
                break
            default: position = faceEmpty; /* console.log('Block-06  Position-EMPTY  (default)'); */ break
        }

        dispatch({type: 'faceFrame', faceFrame: position}) //...and dispatch it as faceFrame
    },

    autoSwitchEyePosition: dispatch => { //utils.autoSwitchEyePosition takes one argument, the reducer in Home.js' dispatch function, in order to call it with type 'faceFrame' and with a random eye position from config.images.eyePosition...
        const randomPosition = Object.entries(eyePosition)[Math.floor(Math.random() * 37)][1] //...Object.entries is a method that takes an object and returns an array whose elements are arrays of that object's key value pairs (i.e. each element is a [key, value]). The value in this case is the image itself (it console.logs as a base64) so    Object.entries(config.images.eyePosition)[0][1]    , for example returns the 1st image,    Object.entries(config.images.eyePosition)[2][1]    returns the 3rd image, etc...
        dispatch({type: 'faceFrame', faceFrame: randomPosition}) //...dispatch the randomPosition as faceFrame
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

    getBoundingClientRectFloats: boundingClientRect => { //utils.getBoundingClientRectFloats takes one argument, boundingClientRect, which is an object representing the measured rectangular boundaries of the referenced element in question containing bottom, top, left and right boundaries as props, considers canvasHeight, canvasWidth and margin to calculate the respective float point values for these boundaries and returns them along with the original measured boundaries. It's called from utils.handleHand which uses ReactDOM.findDOMNode to get the boundingClientRect from the referenced element passed to it
        const { bottom, top, left, right } = boundingClientRect

        return (
            {
                bottom, top, left, right,
                bottomFloat: bottom / canvasHeight,
                topFloat: top / canvasHeight,
                leftFloat: (left - margin) / canvasWidth,
                rightFloat: (right - margin) / canvasWidth
            }
        )
    },

    handleHand: (coords, ref, fn, rateLimit) => { //utils.handleHand takes four arguments, coords, ref, fn and rateLimit and calls fn at the specified rateLimit on the referenced element when the coords (from the tip of the pointing index finger) are within its boundaries. It's called from all components that are tracking the hand for this purpose, namely SocialMenu and AudioPlayer...
        const boundingClientRect = findDOMNode(ref).getBoundingClientRect() //...get the four boundaries of the referenced element...

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

    getTimeString: totalSeconds => { //utils.getTimeString takes one argument, totalSeconds, which is the total number of seconds to be converted to a string in the format 'mm:ss'...
        const positiveTotalSeconds = totalSeconds < 0 ? 0 : totalSeconds //...totalSeconds will be -1 for a spit second when set from the else condition in AudioPlayer's main useEffect so force it to 0 in that case...
        const displaySeconds = positiveTotalSeconds % 60 < 10 ? `0${positiveTotalSeconds % 60}` : `${positiveTotalSeconds % 60}` //...convert the seconds to a string and pad it with a 0 if it's less than 10...
        const displayMinutes = Math.floor(positiveTotalSeconds / 59).toString() //...convert the minutes to a string...
        return `${displayMinutes}:${displaySeconds}` //...and return the time string in the format 'mm:ss'
    },

    getStylesForAudioPlayer: (veilOpacity, isPlaying, hasEnded, hasCoords) => { //utils.getStylesForAudioPlayer takes four arguments, veilOpacity, isPlaying, hasEnded and hasCoords, and returns an object with styles and classNames for AudioPlayer.js. The styles object contains styles for the parentContainer, buttonContainer, icon, slider and timeString, while the classNames object contains class names for the backward, play, pause, stop and forward icons. The styles are calculated based on the various dimensions set in config.constants and the values of the arguments passed

        const parentContainerHeightAndSliderMarginTop = canvasHeight * .1
        const parentContainerWidth = wideScreen ? canvasWidth * .95 - parentContainerHeightAndSliderMarginTop : screenWidth * .95 - parentContainerHeightAndSliderMarginTop
        const parentContainerLeft = wideScreen ? canvasWidth * .025 + margin : screenWidth * .025
        const parentContainerBottom = wideScreen ? canvasWidth * .025 : screenWidth * .025
        const parentContainerPaddingAndTimeStringRight = parentContainerHeightAndSliderMarginTop * .5
        const parentContainerBorderRadius = parentContainerHeightAndSliderMarginTop * .25
        const parentContainerRgbaOpacity = (Math.min(veilOpacity, 0.9) - 0.3) * 0.15

        const buttonContainerAndTimeStringContainerMarginTop = screenWidth / canvasHeight > .59 ? parentContainerHeightAndSliderMarginTop * -.15 : 26

        const iconFontSize = screenWidth > canvasHeight ? canvasHeight * .07 : screenWidth * .07
        const iconPaddingRight = iconFontSize * .15

        const timeStringHorizontalPadding = canvasHeight / 50
        const timeStringBorderRadius = timeStringHorizontalPadding * 2
        const timeStringRgbaOpacity = .045 - parentContainerRgbaOpacity
        const timeStringFontFamily = appFont
        const timeStringFontSize = canvasHeight / 18

        const play = `fa fa-play-circle ${isPlaying ? 'play-active' : (!isPlaying && !hasEnded ? 'pause-active' : 'play-icon')} audio-icon`
        const pause = `fa fa-pause-circle ${!isPlaying && !hasEnded ? 'pause-active' : 'pause-icon'} audio-icon`

        return {
            styles: {
                parentContainer: {
                    position: 'absolute',
                    height: parentContainerHeightAndSliderMarginTop,
                    width: parentContainerWidth,
                    left: parentContainerLeft,
                    bottom: parentContainerBottom,
                    padding: parentContainerPaddingAndTimeStringRight,
                    borderRadius: parentContainerBorderRadius,
                    backgroundColor: `rgba(${hasCoords ? '255,255,255' : '0,0,0'},${parentContainerRgbaOpacity})`,
                    transition: 'background-color 1.5s linear',
                },
                buttonContainer: {
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'row',
                    marginTop: buttonContainerAndTimeStringContainerMarginTop
                },
                icon: {
                    fontSize: `${iconFontSize}px`,
                    paddingRight: `${iconPaddingRight}px`
                },
                slider: {
                    marginTop: parentContainerHeightAndSliderMarginTop
                },
                timeString: {
                    position: 'absolute',
                    margin: 0,
                    paddingLeft: timeStringHorizontalPadding,
                    paddingRight: timeStringHorizontalPadding,
                    borderRadius: timeStringBorderRadius,
                    backgroundColor: `rgba(255,255,255,${timeStringRgbaOpacity})`,
                    transition: 'background-color 1.5s linear',
                    marginTop: buttonContainerAndTimeStringContainerMarginTop,
                    right: parentContainerPaddingAndTimeStringRight,
                    fontFamily: timeStringFontFamily,
                    fontSize: timeStringFontSize,
                    color: 'rgba(30,1,1,.75)'
                }
            },
            classNames: {
                backward: 'fa fa-chevron-circle-left next-and-previous-icons audio-icon',
                play,
                pause,
                stop: 'fa fa-stop-circle stop-icon audio-icon',
                forward: 'fa fa-chevron-circle-right next-and-previous-icons audio-icon'
            }
        }
    },

    getStylesAndRenderingVariablesForCloud: cloudHazeOn => { //utils.getStylesAndRenderingVariablesForCloud takes one argument, cloudHazeOn, and returns an object with styles, classNames (in this case there's only one, the respective cloud icon) and two renderingVariables for Cloud.js. The styles object contains styles for the cloud, the classNames object contains class name for the cloud icon and the renderingVariables object contains the cloudWidth and travelDuration needed for Cloud.js to call utils.fluctuateVeilOpacity. The styles are calculated based on the canvasHeight from config.constants and the value of cloudHazeOn passed...

        const cloudWidth = canvasHeight / (3 + Math.random() * 3) //...cloudWidth is calculated as a function of canvasHeight divided by between 3 and 6, and is used to set the fontSize of the cloud icon, the blur radius of the drop-shadow in styles.cloud.filter, and to return as one of the renderingVariables used by Cloud.js to call utils.fluctuateVeilOpacity...

        const hslaHue = Math.floor(Math.random() * 360) //...hslaHue is used as the hue in styles.cloud.color's hsla template string and is a random number between 0 and 359...
        const hslaAlphaChannel = .3 + Math.random() * .6 //...hslaAlphaChannel is a random number between .3 and .9 and is used as the alpha channel in styles.cloud.color's hsla template string...
        const animationNumber = Math.ceil(Math.random() * 32) //...animationNumber is a random number between 1 and 32 and is used in styles.cloud.animation to select one of the 32 @keyframes in App.css...
        const travelDuration = 24 + Math.random() * 24 //...travelDuration is a random number between 24 and 48 and is used in styles.cloud.animation to set the duration of the cloud's travel across the screen (ideally travelDuration would have been a function of canvasWidth, i.e. inversely proportional to it which is already a function of canvas height and    18000 / canvasHeight + Math.random() * canvasHeight / 18000    worked perfectly but took too long for clouds to enter the screen on small devices)...

        const cloudClassNames = ['fa fa-cloud', 'icon ion-ios-cloud', 'icon ion-md-cloud', 'icon ion-ios-cloudy'] //...cloudClassNames is an array of class names possibilities for the cloud icon...
        const iconClassName = cloudClassNames[Math.floor(Math.random() * 4)] //...iconClassName is a random selection from the cloudClassNames array...

        return {
            styles: {
                cloud: {
                    fontSize: `${cloudWidth}px`,
                    color: `hsla(${hslaHue}, 100%, 96%, ${hslaAlphaChannel})`,
                    filter: !cloudHazeOn ? null : `drop-shadow(0px 0px ${cloudWidth / 4}px hsla(${hslaHue}, 100%, 96%, 1)`, //...this filter prop specifying a drop-shadow had to be added to the styles object because FontAwesome comprises svg files, not fonts, so textShadow (and of course boxShadow) wouldn't worked in this style.cloud object. A drop shadow is effectively a blurred, offset version of the input image's alpha mask, drawn in a specific color and composited below the image, so there's not much wiggle room to do anything too creative with it
                    position: 'absolute',
                    animation: `motionSizeAndFlip${animationNumber} ${travelDuration}s linear forwards`
                }
            },
            classNames: {
                cloud: iconClassName
            },
            renderingVariables: {
                cloudWidth,
                travelDuration
            }
        }
    },

    getStylesClassNamesAndRenderingVariablesForContactForm: (revealContactForm, form) => { //utils.getStylesClassNamesAndRenderingVariablesForContactForm takes two arguments, revealContactForm and form, and returns an object of styles calculated using the dimensions in config.constants and current state of the form object from ContactForm.js, a classNames object containing only the className for the container of the contact form calculated from the dimensions in config.constants and current state of the form object in ContactForm.js, and a renderingVariables object containing only the text for the send button of the contact form based on the current state of the form object...

        return {
            styles: {
                formContainer: {
                    right: wideScreen ? margin : 0
                },
                firstNameField: {
                    backgroundColor: form.firstNameValid !== null ? (form.firstNameValid ? 'rgba(255,255,255,.85)' : 'rgba(255,0,0,.85)') : null
                },
                lastNameField: {
                    backgroundColor: form.lastNameValid !== null ? (form.lastNameValid ? 'rgba(255,255,255,.85)' : 'rgba(255,0,0,.85)') : null
                },
                emailField: {
                    backgroundColor: form.emailValid !== null ? (form.emailValid ? 'rgba(255,255,255,.85)' : 'rgba(255,0,0,.85)') : null
                }
            },
            classNames: {
                formContainer: revealContactForm ? (form.formSent ? (wideScreen ? 'form-container form-container-revealed form-send-wide-animation' : 'form-container form-container-revealed form-send-narrow-animation') : 'form-container form-container-revealed') : 'form-container' //...if revealContactForm is true, then if form.formSent is true, if the screenWidth is more than the canvasWidth (i.e. if wideScreen is true) run the formSendWideAnimation or else run the formSendNarrowAnimation, else if form.formSent is false, just show the form, else if revealContactForm is false, don't show the form at all
            },
            renderingVariables: {
                sendButtonText: form.formSent ? 'Sending now...' : 'Send'
            }
        }
    },

    getStylesForFace: veilOpacity => { //utils.getStylesForFace takes one argument, veilOpacity, and returns an object with styles for the div wrapping the png images from config.images that comprise the face in Face.js. The styles object always returns the same transition but a new faceOpacity based on the veilOpacity passed...

        let faceOpacity = Math.min(veilOpacity - 0.225, 0.3) //...where faceOpacity is the minimum between .3 and the veilOpacity passed minus 0.225

        return {
            styles: {
                face: {
                    opacity: faceOpacity,
                    transition: 'opacity 2.5s linear'
                }
            }
        }
    },

    getStylesAndClassNamesForInfoSheet: revealInfoSheet => { //utils.getStylesAndClassNamesForInfoSheet takes one argument, revealInfoSheet, and returns an object of styles calculated from the dimensions in config.constants and an object of classNames based on the value of revealInfoSheet

        return {
            styles: {
                infoSheet: {
                    left: wideScreen ? margin + canvasWidth - 270 : screenWidth - 270,
                    height: canvasHeight * .8,
                }
            },
            classNames: {
                infoSheet: revealInfoSheet ? 'info-sheet-container info-sheet-container-revealed' : 'info-sheet-container'
            }
        }
    },

    getStylesForRipple: coords => { //utils.getStylesForRipple takes one argument, coords, and returns an object of styles calculated from the dimensions in config.constants and the xCoordStatic and yCoordStatic values in coords...

        const { xCoordStatic, yCoordStatic } = coords

        const diameter = canvasHeight / 10
        const offset = canvasHeight / 20 //...offset is half the diameter of the ripple for the center of the ripple to be the point of contact, and it's also used as the spread of the boxShadow
        const blur = canvasHeight / 35

        return {
            styles: {
                ripple: {
                    width: diameter,
                    height: diameter,
                    left: wideScreen ? margin - offset + canvasWidth * xCoordStatic : screenWidth * xCoordStatic - offset,
                    top: canvasHeight * yCoordStatic - offset,
                    boxShadow: `0 0 ${blur}px ${offset}px #fff, inset 0 0 ${blur}px ${offset}px #fff`
                }
            },
        }
    },

    getStylesAndClassNamesForSocialMenu: (menuPosition, cloudsOn, cloudHazeOn, handControllerOn) => { //utils.getStylesAndClassNamesForInfoSheet takes four arguments, menuPosition, cloudsOn, cloudHazeOn and handControllerOn, and based on those arguments and in conjunction with wideScreen and margin from config.constants returns a styles object and a classNames object

        let socialMenuContainerClasses = 'social-menu-container-open'
        let socialIconsColumn1Classes = 'social-icons-column social-icons-column-open-left-gradient'
        let socialIconsColumn2Classes = 'social-icons-column'
        let pullTabClasses = 'fa'

        switch (menuPosition) {
            case 1:
                socialIconsColumn2Classes += ' social-icons-column-open'
                pullTabClasses += ' fa-angle-double-right pull-chevron-column pull-chevron-column-open'
                break
            case 2:
                socialIconsColumn1Classes += ' social-icons-column-open'
                socialIconsColumn2Classes += ' social-icons-column-open'
                socialMenuContainerClasses += ' social-menu-container-open-wide'
                pullTabClasses += ' fa-angle-double-left pull-chevron-column pull-chevron-column-open'
                break
            case 3:
                socialIconsColumn2Classes += ' social-icons-column-open'
                pullTabClasses += ' fa-angle-double-left pull-chevron-column pull-chevron-column-open'
                break
            case 0:
                pullTabClasses += ' fa-angle-double-right pull-chevron-column'
                break
            default: break
        }

        return {
            styles: {
                socialMenuContainer: {
                    left: wideScreen ? margin : 0
                },
                cloudIcon: {
                    color: cloudsOn ? 'rgb(192,128,255)' : 'rgb(255,255,255)'
                },
                cloudHazeIcon: {
                    color: cloudHazeOn ? 'rgb(80,80,255)' : 'rgb(255,255,255)'
                },
                handControllerIcon: {
                    color: handControllerOn ? 'rgb(255,0,0)' : 'rgb(255,255,255)'
                },
            },
            classNames: {
                socialMenuContainer: socialMenuContainerClasses,
                socialIconsColumn1: socialIconsColumn1Classes,
                socialIconsColumn2: socialIconsColumn2Classes,
                pullTab: pullTabClasses
            }
        }
    },

    getStylesAndClassNamesForSocialMenuLabels: (menuPosition, veilOpacity) => { //utils.getStylesAndClassNamesForSocialMenuLabels takes two arguments, menuPosition and veilOpacity, and based on those arguments and in conjunction with various constants in config.constants returns a styles object and a classNames object...

        let containerClasses = 'social-menu-labels-container'

        switch (menuPosition) {
            case 1:
            case 3:
                containerClasses += ' social-menu-labels-container-visible'
                break
            case 2: containerClasses += ' social-menu-labels-container-wide'
                break
            case 0: containerClasses += ' social-menu-labels-container-invisible'
                break
            default: break
        }

        let socialMenuLabelsOverlapMoon = screenWidth < canvasWidth * .55 //...if the screen is so narrow that the social menu labels overlap the moon...

        return {
            styles: {
                socialMenuLabelsContainer: {
                    color: socialMenuLabelsOverlapMoon ? `rgb(${veilOpacity * 256 - 114.2},1,40)` : 'rgb(255,255,255)', //...change the color of the text to a default of what computes to rgb(1,1,40), which is the same color as the pullTab double chevron on the SocialMenu etc, where the red channel increases as a function of the veilOpacity so that the otherwise default of rgb(1,1,40) doesn't become camouflaged if the room itself becomes too dark with the increase of veilOpacity, otherwise make the text white...
                    left: wideScreen ? margin + 60 : 60 //...and offset the container for the labels exactly 60px from the left border of the canvas so as to make room for the SocialMenu and account for the margin when the canvas is wider than the screen...

                },
                socialMenuLabels: {
                    transition: 'background-color 1.5s linear',
                    backgroundColor: `rgb(255,255,255,${socialMenuLabelsOverlapMoon ? (veilOpacity - .3) * .5 : 0})` //...and if the screen is so narrow that the social menu labels overlap the moon add a translucent white background color to each of the labels whose alpha channel is a function of the veilOpacity, otherwise make their background color transparent
                }
            },
            classNames: {
                socialMenuLabelsContainer: containerClasses
            }
        }
    },

    getStylesForTrack: (isSelected, leftColumn) => { //utils.getStylesAndClassNamesForSocialMenuLabels takes two boolean arguments, isSelected and leftColumn, and based on those arguments and in conjunction with various constants in config.constants returns a styles object...

        return {
            styles: {
                trackContainer: { //...for the trackContainer that contains the trackTitle...
                    position: 'relative', //...where position is always relative...
                    [ leftColumn ? 'left' : 'right' ]: wideScreen ? margin : 0 //...but the prop corresponding to that relative positioning becomes left or right dynamically based on the leftColumn argument, and that dynamic prop's value set according to both whether or not wideScreen from config.constants is true and, if so, the size of the margin that falls outside the canvas...
                },
                trackTitle: { //...and for the trackTitles themselves...
                    transform:  isSelected ? 'scale(1.2)' : null, //...if the track is selected scale it up by 20%...
                    fontSize: `${wideScreen ? canvasHeight / 35 * aspectRatio : screenWidth / 38}px`, //...calculate its fontSize as a function of either canvasHeight or screenWidth depending on whether wideScreen is true or not, respectively, and where if the former the aspectRatio is factored in with a denominator of 35 and if the latter aspectRatio is not factored in but a denominator of 38 is. The respective denominators happen to work well to ensure an optimal fontSize for each trackTitle relative to the respective dimensions of the screen and of the canvas...
                    color: isSelected ? 'rgba(255,0,0,.85)' : null, //...if the track is selected make its color red...
                    margin: `${canvasHeight / 40}px` //...and give it a margin of 2.5% of the canvasHeight
                }
            }
        }
    },

    getStylesForVeil: veilOpacity => { //utils.getStylesForVeil takes one argument, veilOpacity, and returns an object containing the calculated opacity for Veil.js as well as the unchanged transition...

        return {
            styles: {
                veil: {
                    opacity: veilOpacity >= 1 ? '.9' : veilOpacity.toFixed(1), //...float point conversion from the addition and subtraction of .15 from Cloud.js calling utils.fluctuateVeilOpacity was giving values like '8.9999999999999' so rounding to one decimal place here
                    transition: 'opacity 1.5s linear'
                }
            }
        }
    },

    parseAndRenderPhotoData: (photoAlbumSlug, setPhotoAlbumSlug, navigate) => { //utils.parseAndRenderPhotoData takes three arguments, photoAlbumSlug and setPhotoAlbumSlug, which are the state and setState functions from TravelPhotos wherein it's called, and navigate, which is a reference to react-router-dom's navigation hook. If a photo album is open it returns a react-photo-view PhotoProvider component (carousel) with a PhotoView child for each of the photos in the specified album, otherwise it returns a page of divs displaying photo album titles and cover photos...

        if (photoAlbumSlug !== '') { //...if photoAlbumSlug is not an empty string, meaning a photo album is open...
            const fullArray = photoData.find(i => i.slug === photoAlbumSlug).fullString.split(' ') //...create an array of urls of the hi res photos for that album...

            return ( //...and return a PhotoProvider component with PhotoView children for each of the photos in the album...
                <PhotoProvider
                    speed={() => 0} //...where speed is set to 0 so the carousel is quick...
                    loop={3} //...loop is 3 so the carousel looks ahead 3 images to download them...
                    pullClosable={false} //...pullClosable is false so the carousel can't be closed by pulling down because it tends to happen inadvertently when a user is swiping on mobile...
                    //maskOpacity={0.9} //...(this is a relic of my old implementation which had the issues caused by react-photo-view's rigidity as described in annotations to utils.simulateClickOrTouch)...
                    //onVisibleChange={() => {}} //...I might use this prop for something in the future...
                    afterClose={() => {setPhotoAlbumSlug(''); navigate('/travel-photos')}} //...afterClose, called when PhotoProvider is closed, sets photoAlbumSlug back to an empty string and uses react-router-dom's navigation hook to make the url path '/travel-photos'...
                    loadingElement={
                        <div className='loading-screen'>
                            <div className='cube-container'>
                                <div className='cube'></div>
                            </div>
                        </div>
                    }
                    brokenElement={ <div style={{ color: 'white', fontSize: '48pt' }} onClick={() => console.log('Attempting to reload...')}>Failed... Click to retry.</div> } //TODO: Extend brokenElement div to include a retry button whose onClick calls the fetch function again
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
            return ( //...return a page of lazy loading divs displaying photo album titles and their associated cover photos from photoData, which when clicked each set photoAlbumSlug to the slug of the associated photo album...
                <div className='card-page'>
                    {
                        photoData.map(i => {
                            return (
                                <div key={i.slug} className='album-container'>
                                    <h2 className='album-name'>{i.albumName.substring(16)}</h2>
                                    <img
                                        src={i.albumCover}
                                        className='album-cover'
                                        onClick={() => { setPhotoAlbumSlug(i.slug); window.history.pushState(i.slug, '', `/travel-photos/${i.slug}`)}} //...using window.history.pushState, which takes three parameters, a state, a title and a path (the second, i.e. the title, which is ignored by most browsers) to push the slug to the URL path
                                        alt='' loading='lazy' />
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
