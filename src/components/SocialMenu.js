import React from 'react'

class SocialMenu extends React.PureComponent {
    constructor() {
        super()
        this.state = {

        }
    }

    render() {

        let left = this.props.canvasWidth < this.props.screenWidth ? this.props.margin : 0
        let pullTabClassName = this.props.menuOpen ? 'fa fa-angle-double-left pull-chevron-column pull-chevron-column-open' : 'fa fa-angle-double-right pull-chevron-column'
        let socialIconsColumnClassName = this.props.menuOpen ? 'social-icons-column social-icons-column-open' : 'social-icons-column'

        return(
            <div className='social-menu-container' style={{left: left}}>

                <div className={socialIconsColumnClassName}>
                    <i className={'icon ion-md-mail mail social-icon'} onClick={() => this.props.toggleContactForm()}></i>
                    <a className='linkedin social-icon' href='https://www.linkedin.com/in/dvho' target='_blank' rel='noopener noreferrer'><i className={'icon ion-logo-linkedin'}></i></a>
                    <a className='resume social-icon' href='https://dvho.github.io/resume' target='_blank' rel='noopener noreferrer'><i className={'icon ion-md-paper'}></i></a>
                    <a className='github social-icon' href='https://github.com/dvho' target='_blank' rel='noopener noreferrer'><i className={'icon ion-logo-github'}></i></a>
                    <a className='npm social-icon' href='https://www.npmjs.com/~dvho' target='_blank' rel='noopener noreferrer'><i className={'icon ion-logo-npm'}></i></a>
                    <i className={'fa fa-info-circle info social-icon'} onClick={() => this.props.toggleInfoSheet()}></i>

                </div>

                <i className={pullTabClassName} onClick={() => this.props.toggleMenuOpen()}></i>

            </div>
        )
    }
}

export default SocialMenu
