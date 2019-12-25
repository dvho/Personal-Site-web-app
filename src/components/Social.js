import React from 'react'

class Social extends React.Component {
    constructor() {
        super()
        this.state = {

        }
    }
    render() {
        
        return(
            <div style={{position: 'absolute', width: 100, height: 100, background: 'red'}} onClick={() => this.props.toggleContactForm()}></div>
        )
    }
}

export default Social
