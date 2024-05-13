import { PhotoProvider, PhotoView } from 'react-photo-view' //https://react-photo-view.vercel.app/en-US/docs/getting-started
import 'react-photo-view/dist/react-photo-view.css'


import '../../App.css'


const utils = {

    parsePhotoAlbumData: (data, set, setSet) => {

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
