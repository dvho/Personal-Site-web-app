const state = {}

const calcWindowHeight = () => {
    state.windowHeight = window.innerHeight * 0.755530973451327
    return `${state.windowHeight}`
}

['load', 'resize'].forEach(i => window.addEventListener(i, calcWindowHeight))


const cloud = `
    <div class="clouds" style=top:${calcWindowHeight()/(Math.random() * 2.5 + 1.6)}px;>
        <i class="fa fa-cloud" style="font-size:${calcWindowHeight()/4}px; transform: translateX(-140px) translateY(50%) scale(1.2) rotateY(${Math.round(Math.random())===1 ? 0 : 180}deg); color:blue;"></i>
    </div>

    <div class="clouds" style=top:${calcWindowHeight()/(Math.random() * 2.5 + 1.6)}px;>
        <i class="fa fa-cloud" style="font-size:${calcWindowHeight()/4}px; transform: translateX(-140px) translateY(50%) scale(.8) rotateY(${Math.round(Math.random())===1 ? 0 : 180}deg); color:red;"></i>
    </div>
`



const backTreesOnly = document.getElementById('back-trees-only-image')
const veilImage = document.getElementById('veil-image')

veilImage.style.opacity = '.7'
backTreesOnly.insertAdjacentHTML('beforebegin', cloud)


console.log(calcWindowHeight())
