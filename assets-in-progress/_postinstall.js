const fs = require('fs')
const path = require('path')

const copyFile = fileName => {
    fs.copyFile(
        path.join(__dirname, `node_modules/@mediapipe/hands/${fileName}`),
        path.join(__dirname, `public/hands/${fileName}`),
        (err) => {
            if (err) throw err
            console.log(`node_modules/@mediapipe/hands/${fileName} was copied to public/hands/${fileName}`)
        }
    )
}


const allFileNamesInNodeModulesMediapipeHands = fs.readdirSync('node_modules/@mediapipe/hands')


allFileNamesInNodeModulesMediapipeHands.forEach(i => {
    copyFile(i)
})
