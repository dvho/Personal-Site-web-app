import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import './App.css'
import 'react-photo-view/dist/react-photo-view.css' //This is indeed needed for react-photo-view's PhotoProvider to display, which is used by TravelPhotos.js via utils.parseAndRenderPhotoData

ReactDOM.render(<App />, document.getElementById('root'))
