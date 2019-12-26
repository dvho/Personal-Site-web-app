import React from 'react'
import '../App.css'

class SocialMenu extends React.Component {
    constructor() {
        super()
        this.state = {
            menuOpen: false
        }
    }

    render() {

        let left = this.props.canvasWidth < this.props.screenWidth ? this.props.margin : 0
        let pullTabClassName = this.state.menuOpen ? 'fa fa-angle-double-left pullArrowColumn pullArrowColumnOpen' : 'fa fa-angle-double-right pullArrowColumn'
        let socialIconsColumnClassName = this.state.menuOpen ? 'socialIconsColumn socialIconsColumnOpen' : 'socialIconsColumn'

        return(
            <div className='socialMenuContainer' style={{left: left}}>

                <div className={socialIconsColumnClassName}>
                    <i className={'icon ion-md-mail mail social-icon'} onClick={() => this.props.toggleContactForm()}></i>
                    <a className='resume social-icon' href='https://dvho.github.io/resume/' target='_blank'><i className={'icon ion-md-paper social-icon'}></i></a>
                    <a className='github social-icon' href='https://github.com/dvho' target='_blank'><i className={'icon ion-logo-github social-icon'}></i></a>
                    <a className='npm social-icon' href='https://www.npmjs.com/~dvho' target='_blank'><i className={'icon ion-logo-npm social-icon'}></i></a>
                </div>

                <i className={pullTabClassName} onClick={() => this.setState({menuOpen: !this.state.menuOpen})}></i>

            </div>
        )
    }
}

export default SocialMenu
