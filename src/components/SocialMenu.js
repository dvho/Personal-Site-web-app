import React from 'react'

const SocialMenu = props => {

    if (props.screenWidth === 0) { //This prevents the unnecesary render caused by App.js not yet having its state set in componentDidMount when the first render happens
        return
    }

    let left = props.wideScreen ? props.margin : 0
    let pullTabClassName = props.menuOpen ? 'fa fa-angle-double-left pull-chevron-column pull-chevron-column-open' : 'fa fa-angle-double-right pull-chevron-column'
    let socialIconsColumnClassName = props.menuOpen ? 'social-icons-column social-icons-column-open' : 'social-icons-column'

    return(
        <div className='social-menu-container' style={{left: left}}>

            <div className={socialIconsColumnClassName}>
                <i className={'icon ion-md-mail mail social-icon'} onClick={() => props.toggleContactForm()}></i>
                <a className='linkedin social-icon' href='https://www.linkedin.com/in/dvho' target='_blank' rel='noopener noreferrer'><i className={'icon ion-logo-linkedin'}></i></a>
                <a className='resume social-icon' href='https://dvho.github.io/resume' target='_blank' rel='noopener noreferrer'><i className={'icon ion-md-paper'}></i></a>
                <a className='github social-icon' href='https://github.com/dvho' target='_blank' rel='noopener noreferrer'><i className={'icon ion-logo-github'}></i></a>
                <a className='npm social-icon' href='https://www.npmjs.com/~dvho' target='_blank' rel='noopener noreferrer'><i className={'icon ion-logo-npm'}></i></a>
                <i className={'fa fa-info-circle info social-icon'} onClick={() => props.toggleInfoSheet()}></i>

            </div>

            <i className={pullTabClassName} onClick={() => props.toggleMenuOpen()}></i>

        </div>
    )
}

export default React.memo(SocialMenu) //I was getting unnecesary renders here so I'm wrapping the export of the component in React.memo, which does a shallow comparison for function components as React.PureComponent, or the older lifecycle method componentShouldUpdate(), do shallow comparisons to limit unnecessary re-rendering in class components. One could also simply wrap the code block of the component itself in React.memo but I think doing it in the export is cleaner.
