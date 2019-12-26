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
                    <i className={'icon ion-md-mail mail'} onClick={() => this.props.toggleContactForm()}></i>
                    <a className='github' href='https://github.com/dvho' target='_blank'><i className={'icon ion-logo-github github'}></i></a>
                    <a className='npm' href='https://www.npmjs.com/~dvho' target='_blank'><i className={'icon ion-logo-npm npm'}></i></a>
                </div>

                <i className={pullTabClassName} onClick={() => this.setState({menuOpen: !this.state.menuOpen})}></i>

            </div>
        )
    }
}

export default SocialMenu
