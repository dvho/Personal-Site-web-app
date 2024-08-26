import { lyrics } from './assets/data'

const screenWidth = window.visualViewport === undefined ? window.innerWidth : window.visualViewport.width //Chrome mobile uses window.visualViewport property instead of the window object directly
const canvasHeight = window.visualViewport === undefined ? window.innerHeight : window.visualViewport.height //Chrome mobile uses window.visualViewport property instead of the window object directly
const canvasWidth = Math.round(canvasHeight * 1.323572474377745) //screenWidth < canvasHeight * 1.323572474377745 ? screenWidth : Math.round(canvasHeight * 1.323572474377745)
const wideScreen = screenWidth > canvasWidth ? true : false //This simple calculation was happening redundantly in so many components I decided to do it once here and subsequently pass as a prop to any of them that need it
const moonDiameter = Math.round(canvasWidth * 0.199121522693997)
const margin = ((screenWidth - canvasWidth) / 2)
const aspectRatio = 1808 / 1366 //This is the aspect ratio of the canvas (derived from the dimensions of main.png)

const config = {

    constants: {
        screenWidth,
        canvasHeight,
        canvasWidth,
        wideScreen,
        moonDiameter,
        margin,
        aspectRatio,
        blinkFrameDelays: [.09, .14, .20, .27, .36, .47, .60, .75, .92, 1.1]
    },
    initialStates: {
        home: {
            //Component visibility and performance features
            cloudsOn: true,
            cloudHazeOn: false,
            handControllerOn: false,
            revealContactForm: false,
            revealInfoSheet: false,
            menuPosition: 2,
            //Tracks
            currentTrack: {},
            leftColumnTracks: [],
            rightColumnTracks: [],
            titlesColumnsMargin: 0,
            //Coords and controllers
            coords: { xCoordMoving: -1, yCoordMoving: -1, xCoordStatic: -1, yCoordStatic: -1 },
            isHandPointing: false,
            isRippling: false,
            isBlinking: false,
            //Eyes and main display
            faceFrame: require('./assets/images/face-empty.png'), //If the config.initialStates.home object were set in Home.js and passed directly to the reducer as useReducer(reducer, initialState) it would simply be set to config.images.eyePosition.faceEmpty, but since it's set here in the config object of _config.js and passed to the reducer as useReducer(reducer, config.initialStates.home) it must be set to require('./assets/images/face-empty.png') because at this juncture the images object hasn't yet been defined in the config object of _config.js
            allClouds: [],
            veilOpacity: .45
        },
        contactForm: {
            formSent: false,
            firstNameValid: null,
            lastNameValid: null,
            emailValid: null,
            firstName: '',
            lastName: '',
            email: '',
            subject: '',
            message: ''
        }
    },
    images: {
        appFont: 'Nothing You Could Do, cursive',
        formFont: 'Cormorant Garamond, serif',
        dummyImage: require('./assets/images/blank-single-pixel.png'),
        canvas: {
            backTreesOnly: require('./assets/images/back-trees-only.png'),
            back: require('./assets/images/back.png'),
            main: require('./assets/images/main.png'),
            veil: require('./assets/images/veil.png'),
            faceMain: require('./assets/images/face-main.png')
        },
        blink: {
            faceBlinkA: require('./assets/images/face-blink-A.png'),
            faceBlinkB: require('./assets/images/face-blink-B.png'),
            faceBlinkC: require('./assets/images/face-blink-C.png'),
            faceBlinkD: require('./assets/images/face-blink-D.png'),
            faceBlinkE: require('./assets/images/face-blink-E.png'),
            faceBlinkF: require('./assets/images/face-blink-F.png')
        },
        eyePosition: {
            faceEmpty: require('./assets/images/face-empty.png'),
            faceEyePosition1L1: require('./assets/images/face-1L1.png'),
            faceEyePosition1L2: require('./assets/images/face-1L2.png'),
            faceEyePosition1L3: require('./assets/images/face-1L3.png'),
            faceEyePosition1R1: require('./assets/images/face-1R1.png'),
            faceEyePosition1R2: require('./assets/images/face-1R2.png'),
            faceEyePosition1R3: require('./assets/images/face-1R3.png'),
            faceEyePosition1R4: require('./assets/images/face-1R4.png'),
            faceEyePosition2L1: require('./assets/images/face-2L1.png'),
            faceEyePosition2L2: require('./assets/images/face-2L2.png'),
            faceEyePosition2L3: require('./assets/images/face-2L3.png'),
            faceEyePosition2L4: require('./assets/images/face-2L4.png'),
            faceEyePosition2R2: require('./assets/images/face-2R2.png'),
            faceEyePosition2R3: require('./assets/images/face-2R3.png'),
            faceEyePosition2R4: require('./assets/images/face-2R4.png'),
            faceEyePosition3L1: require('./assets/images/face-3L1.png'),
            faceEyePosition3L2: require('./assets/images/face-3L2.png'),
            faceEyePosition3L3: require('./assets/images/face-3L3.png'),
            faceEyePosition3R1: require('./assets/images/face-3R1.png'),
            faceEyePosition3R2: require('./assets/images/face-3R2.png'),
            faceEyePosition3R3: require('./assets/images/face-3R3.png'),
            faceEyePosition4L1: require('./assets/images/face-4L1.png'),
            faceEyePosition4L2: require('./assets/images/face-4L2.png'),
            faceEyePosition4L3: require('./assets/images/face-4L3.png'),
            faceEyePosition4L4: require('./assets/images/face-4L4.png'),
            faceEyePosition4R1: require('./assets/images/face-4R1.png'),
            faceEyePosition4R2: require('./assets/images/face-4R2.png'),
            faceEyePosition4R3: require('./assets/images/face-4R3.png'),
            faceEyePosition4R4: require('./assets/images/face-4R4.png'),
            faceEyePosition5L1: require('./assets/images/face-5L1.png'),
            faceEyePosition5L2: require('./assets/images/face-5L2.png'),
            faceEyePosition5L3: require('./assets/images/face-5L3.png'),
            faceEyePosition5L4: require('./assets/images/face-5L4.png'),
            faceEyePosition5L5: require('./assets/images/face-5L5.png'),
            faceEyePosition5R1: require('./assets/images/face-5R1.png'),
            faceEyePosition5R2: require('./assets/images/face-5R2.png'),
            faceEyePosition5R3: require('./assets/images/face-5R3.png'),
            faceEyePosition5R4: require('./assets/images/face-5R4.png')
        }
    },
    tracks: [ //Originally, these tracks were bounced to wav format from their Pro Tools’ sessions, then exported to m4a in QuickTime Player, then their file extension was simply changed from m4a to mp4 per Paul Roberts' 2013, 06-17th answer on    https://stackoverflow.com/questions/9412384/m4a-mp4-file-format-whats-the-difference-or-are-they-the-same    , then they were uploaded to GitHub's CDN by creating a new "issue" at    https://github.com/dvho/Personal-Site-web-app/issues/new    , each dragged-and-dropped/attached to the new ticket so that GitHub would automatically generate CDN URLs for each so that each generated URL could then be used as the value of the url prop in the respective song’s object in the array of tracks. The circuitous conversion to mp4 was because GitHub's CDN only supports mp4, not mp3 nor any other audio format. But upon deploying it was discovered that upon attempting to play an mp4 iOS Safari, as of iOS 15.4, unilaterally and uncontrollably launches an extraneous window that overlays any site. I quickly reverted back to hosting the files locally within the project as mp3s (bouncing directly to mp3 format from Pro Tools), e.g.    require('../assets/music/track_name.mp3')    , at the expense of these tracks being cached when a user first loads the site. Eventually I stored the mp3s with Google Firebase, logging into my primary Google account associated with this/my main GitHub account, visiting console.firebase.google.com, clicking "Creat a new project", creating a project named "music", not adding Google Analytics nor Firebase Hosting, and when project creation had completed clicking "See all Firebase features" so I could ⌘+F for and click "Storage", click "Get started" and upload my music in mp3
        {
            title: 'Believe in You',
            url: 'https://firebasestorage.googleapis.com/v0/b/music-e317c.appspot.com/o/Believe%20in%20You-35.mp3?alt=media&token=002fe75e-f946-4bdc-b13f-fa133d15c9ab', //This was first    'https://user-images.githubusercontent.com/45696445/184548499-cb11f1ac-66ad-4afd-a4fd-7ac5377b5a1e.mp4'    then    require('./assets/music/Believe in You-35.mp3')    before eventualy storing with Google Firebase
            slug: 'believe-in-you',
            lyrics: lyrics.believeInYou
        },
        {
            title: 'I Wish it Was Raining',
            url: 'https://firebasestorage.googleapis.com/v0/b/music-e317c.appspot.com/o/I%20Wish%20It%20Were%20Raining-23.mp3?alt=media&token=db82fca0-2402-46d9-81d5-7ff3f10e1ac9', //This was first    'https://user-images.githubusercontent.com/45696445/184548545-190fab63-9d29-47d4-be7b-2af7a54cc070.mp4'    then    require('./assets/music/I Wish It Were Raining-23.mp3')    before eventualy storing with Google Firebase
            slug: 'i-wish-it-was-raining',
            lyrics: lyrics.iWishItWasRaining
        },
        {
            title: 'How Could You Say That',
            url: 'https://firebasestorage.googleapis.com/v0/b/music-e317c.appspot.com/o/How%20Could%20You%20Say%20That-38.mp3?alt=media&token=8b2aa0d7-03fa-4011-bd7c-b33b3487182a', //This was first    'https://user-images.githubusercontent.com/45696445/184548559-a52249fe-b1b0-47ec-bd93-f72d1b3d4523.mp4'    then    require('./assets/music/How Could You Say That-38.mp3')    before eventualy storing with Google Firebase
            slug: 'how-could-you-say-that',
            lyrics: lyrics.howCouldYouSayThat
        },
        {
            title: 'No Answer, No Wonder',
            url: 'https://firebasestorage.googleapis.com/v0/b/music-e317c.appspot.com/o/Fire%20and%20Acid%20Rain-24.mp3?alt=media&token=e37173dc-12c3-49f2-9374-3bda236a8a63', //This was first    'https://user-images.githubusercontent.com/45696445/184548566-7351c4a5-dbb1-4b6e-b63b-b3d93386f0e7.mp4'    then    require('./assets/music/Fire and Acid Rain-24.mp3')    before eventualy storing with Google Firebase
            slug: 'no-answer-no-wonder',
            lyrics: lyrics.noAnswerNoWonder
        },
        {
            title: 'Forgive',
            url: 'https://firebasestorage.googleapis.com/v0/b/music-e317c.appspot.com/o/I%20Will%20Not%20Forgive-18.mp3?alt=media&token=69dc301d-ccbd-41a5-8722-4c5547189184', //This was first    'https://user-images.githubusercontent.com/45696445/184548579-4156fb08-146a-4397-ab3f-00c1d7443c84.mp4'    then    require('./assets/music/I Will Not Forgive-18.mp3')    before eventualy storing with Google Firebase
            slug: 'forgive',
            lyrics: lyrics.forgive
        },
        {
            title: 'Highest Mountain',
            url: 'https://firebasestorage.googleapis.com/v0/b/music-e317c.appspot.com/o/Highest%20Mountain-18.mp3?alt=media&token=a2e61c3b-3f46-4606-863a-871c455840cc', //This was first    'https://user-images.githubusercontent.com/45696445/184548780-6b432913-2da1-484d-99d1-e7a1436ee6d5.mp4'    then    require('./assets/music/Highest Mountain-18.mp3')    before eventualy storing with Google Firebase
            slug: 'highest-mountain',
            lyrics: lyrics.highestMountain
        },
        {
            title: 'Driving and Crying',
            url: 'https://firebasestorage.googleapis.com/v0/b/music-e317c.appspot.com/o/Driving%20and%20Crying-16.mp3?alt=media&token=0bb98a70-81cb-4c86-b139-d2c12dc384a8', //This was first    'https://user-images.githubusercontent.com/45696445/184548802-1e1a3774-8690-4a03-87b4-841fded80e3d.mp4'    then    require('./assets/music/Driving and Crying-16.mp3')    before eventualy storing with Google Firebase
            slug: 'driving-and-crying',
            lyrics: lyrics.drivingAndCrying
        },
        {
            title: 'Baby Elephant',
            url: 'https://firebasestorage.googleapis.com/v0/b/music-e317c.appspot.com/o/Baby%20Elephant-07.mp3?alt=media&token=e2687280-3411-4401-9776-466b2b58de8b', //This was first    'https://user-images.githubusercontent.com/45696445/184548815-bba690ab-7da0-43ca-88b8-0c7f449ee46b.mp4'    then    require('./assets/music/Baby Elephant-07.mp3')    before eventualy storing with Google Firebase
            slug: 'baby-elephant',
            lyrics: lyrics.babyElephant
        },
        {
            title: 'Bad Place',
            url: 'https://firebasestorage.googleapis.com/v0/b/music-e317c.appspot.com/o/Bad%20Place-08.mp3?alt=media&token=152bbc0a-8550-4022-b15d-5892dfdf54e8', //This was first    'https://user-images.githubusercontent.com/45696445/184548835-6de33283-8c91-4336-976e-d5794171530f.mp4'    then    require('./assets/music/Bad Place-08.mp3')    before eventualy storing with Google Firebase
            slug: 'bad-place',
            lyrics: lyrics.badPlace
        },
        {
            title: 'I\'m Just Standing Here',
            url: 'https://freesound.org/data/previews/345/345852_387219-lq.mp3', //Eventually this will be "I'm Just Standing Here"
            slug: 'im-just-standing-here',
            lyrics: lyrics.imJustStandingHere
        }
    ]

}

export default config
