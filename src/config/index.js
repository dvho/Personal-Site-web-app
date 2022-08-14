import lyrics from '../assets/lyrics'

const config = {

    images: {
        canvas: {
            backTreesOnly: require('../assets/images/back-trees-only.png'),
            back: require('../assets/images/back.png'),
            main: require('../assets/images/main.png'),
            veil: require('../assets/images/veil.png'),
            faceMain: require('../assets/images/face-main.png')
        },
        blink: {
            faceBlinkA: require('../assets/images/face-blink-A.png'),
            faceBlinkB: require('../assets/images/face-blink-B.png'),
            faceBlinkC: require('../assets/images/face-blink-C.png'),
            faceBlinkD: require('../assets/images/face-blink-D.png'),
            faceBlinkE: require('../assets/images/face-blink-E.png'),
            faceBlinkF: require('../assets/images/face-blink-F.png')
        },
        eyePosition: {
            faceEmpty: require('../assets/images/face-empty.png'),
            faceEyePosition1L1: require('../assets/images/face-1L1.png'),
            faceEyePosition1L2: require('../assets/images/face-1L2.png'),
            faceEyePosition1L3: require('../assets/images/face-1L3.png'),
            faceEyePosition1R1: require('../assets/images/face-1R1.png'),
            faceEyePosition1R2: require('../assets/images/face-1R2.png'),
            faceEyePosition1R3: require('../assets/images/face-1R3.png'),
            faceEyePosition1R4: require('../assets/images/face-1R4.png'),
            faceEyePosition2L1: require('../assets/images/face-2L1.png'),
            faceEyePosition2L2: require('../assets/images/face-2L2.png'),
            faceEyePosition2L3: require('../assets/images/face-2L3.png'),
            faceEyePosition2L4: require('../assets/images/face-2L4.png'),
            faceEyePosition2R2: require('../assets/images/face-2R2.png'),
            faceEyePosition2R3: require('../assets/images/face-2R3.png'),
            faceEyePosition2R4: require('../assets/images/face-2R4.png'),
            faceEyePosition3L1: require('../assets/images/face-3L1.png'),
            faceEyePosition3L2: require('../assets/images/face-3L2.png'),
            faceEyePosition3L3: require('../assets/images/face-3L3.png'),
            faceEyePosition3R1: require('../assets/images/face-3R1.png'),
            faceEyePosition3R2: require('../assets/images/face-3R2.png'),
            faceEyePosition3R3: require('../assets/images/face-3R3.png'),
            faceEyePosition4L1: require('../assets/images/face-4L1.png'),
            faceEyePosition4L2: require('../assets/images/face-4L2.png'),
            faceEyePosition4L3: require('../assets/images/face-4L3.png'),
            faceEyePosition4L4: require('../assets/images/face-4L4.png'),
            faceEyePosition4R1: require('../assets/images/face-4R1.png'),
            faceEyePosition4R2: require('../assets/images/face-4R2.png'),
            faceEyePosition4R3: require('../assets/images/face-4R3.png'),
            faceEyePosition4R4: require('../assets/images/face-4R4.png'),
            faceEyePosition5L1: require('../assets/images/face-5L1.png'),
            faceEyePosition5L2: require('../assets/images/face-5L2.png'),
            faceEyePosition5L3: require('../assets/images/face-5L3.png'),
            faceEyePosition5L4: require('../assets/images/face-5L4.png'),
            faceEyePosition5L5: require('../assets/images/face-5L5.png'),
            faceEyePosition5R1: require('../assets/images/face-5R1.png'),
            faceEyePosition5R2: require('../assets/images/face-5R2.png'),
            faceEyePosition5R3: require('../assets/images/face-5R3.png'),
            faceEyePosition5R4: require('../assets/images/face-5R4.png'),
            clock800: require('../assets/images/face-5R4.png'),
            clock900: require('../assets/images/face-4R4.png'),
            clock915: require('../assets/images/face-3R3.png'),
            clock930: require('../assets/images/face-2R4.png'),
            clock945: require('../assets/images/face-1R4.png'),
            clock1000: require('../assets/images/face-1R3.png'),
            clock1030: require('../assets/images/face-1R2.png'),
            clock1100: require('../assets/images/face-1R1.png'),
            clock1200: require('../assets/images/face-1L1.png'),
            clock100: require('../assets/images/face-1L2.png'),
            clock200: require('../assets/images/face-1L3.png'),
            clock230: require('../assets/images/face-2L4.png'),
            clock300: require('../assets/images/face-3L3.png'),
            clock330: require('../assets/images/face-4L4.png'),
            clock400: require('../assets/images/face-5L5.png'),
            clock415: require('../assets/images/face-5L4.png'),
            clock430: require('../assets/images/face-5L3.png'),
            clock445: require('../assets/images/face-5L2.png'),
            clock500: require('../assets/images/face-5L1.png'),
            clock700: require('../assets/images/face-5R1.png'),
            clock730: require('../assets/images/face-5R2.png'),
            clock745: require('../assets/images/face-5R3.png')
        }
    },
    appFont: 'Nothing You Could Do, cursive',
    formFont: 'Cormorant Garamond, serif',
    tracks: [ //These tracks were bounced to WAV format from their Pro Tools sessions, then exported to m4a in QuickTime Player, then the file extension was simply changed from m4a to mp4 per Paul Roberts' 2013, 06-17th answer on    https://stackoverflow.com/questions/9412384/m4a-mp4-file-format-whats-the-difference-or-are-they-the-same    , then after deploying it was discovered that iOS Safari, as of iOS 15.4, unilaterally and uncontrollably launches an extraneous window that overlays any audio playing from a site if the audio is streaming from a url such as a CDN rather than being hosted locally. I had to revert back to my require('.../assets/music/track_name') format at the expense of these tracks being cached when a user first loads the site. THEN it was further discovered that this behavior by iOS Safari has nothing to do with streaming from a url vs the require method and everything to do with the encoding format, mp3 vs mp4, the latter which is the only audio format github allows. When songs are encoded in mp4 iOS Safari launches the window that breaks the site and when they're encoded in mp3, regardless of whether or not they're hosted within the project and required in or on a CDN and streamed, iOS Safari doesn't launch the frustrating, brutal and tasteless window
        {
            title: 'Believe in You',
            url: require('../assets/music/Believe in You-35.mp3'), //This used to be 'https://user-images.githubusercontent.com/45696445/184548499-cb11f1ac-66ad-4afd-a4fd-7ac5377b5a1e.mp4'
            slug: 'believe-in-you',
            lyrics: lyrics.believeInYou
        },
        {
            title: 'I Wish it Was Raining',
            url: require('../assets/music/I Wish It Were Raining-23.mp3'), //This used to be 'https://user-images.githubusercontent.com/45696445/184548545-190fab63-9d29-47d4-be7b-2af7a54cc070.mp4'
            slug: 'i-wish-it-was-raining',
            lyrics: lyrics.iWishItWasRaining
        },
        {
            title: 'How Could You Say That',
            url: require('../assets/music/How Could You Say That-38.mp3'), //This used to be 'https://user-images.githubusercontent.com/45696445/184548559-a52249fe-b1b0-47ec-bd93-f72d1b3d4523.mp4'
            slug: 'how-could-you-say-that',
            lyrics: lyrics.howCouldYouSayThat
        },
        {
            title: 'No Answer, No Wonder',
            url: require('../assets/music/Fire and Acid Rain-24.mp3'), //This used to be 'https://user-images.githubusercontent.com/45696445/184548566-7351c4a5-dbb1-4b6e-b63b-b3d93386f0e7.mp4'
            slug: 'no-answer-no-wonder',
            lyrics: lyrics.noAnswerNoWonder
        },
        {
            title: 'Forgive',
            url: require('../assets/music/I Will Not Forgive-18.mp3'), //This used to be 'https://user-images.githubusercontent.com/45696445/184548579-4156fb08-146a-4397-ab3f-00c1d7443c84.mp4'
            slug: 'forgive',
            lyrics: lyrics.forgive
        },
        {
            title: 'Highest Mountain',
            url: require('../assets/music/Highest Mountain-18.mp3'), //This used to be 'https://user-images.githubusercontent.com/45696445/184548780-6b432913-2da1-484d-99d1-e7a1436ee6d5.mp4'
            slug: 'highest-mountain',
            lyrics: lyrics.highestMountain
        },
        {
            title: 'Driving and Crying',
            url: require('../assets/music/Driving and Crying-16.mp3'), //This used to be 'https://user-images.githubusercontent.com/45696445/184548802-1e1a3774-8690-4a03-87b4-841fded80e3d.mp4'
            slug: 'driving-and-crying',
            lyrics: lyrics.drivingAndCrying
        },
        {
            title: 'Baby Elephant',
            url: require('../assets/music/Baby Elephant-07.mp3'), //This used to be 'https://user-images.githubusercontent.com/45696445/184548815-bba690ab-7da0-43ca-88b8-0c7f449ee46b.mp4'
            slug: 'baby-elephant',
            lyrics: lyrics.babyElephant
        },
        {
            title: 'Bad Place',
            url: require('../assets/music/Bad Place-08.mp3'), //This used to be 'https://user-images.githubusercontent.com/45696445/184548835-6de33283-8c91-4336-976e-d5794171530f.mp4'
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
