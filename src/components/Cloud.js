import React from 'react'

class Cloud extends React.Component {
    constructor() {
        super()
        this.state = {

        }
    }

    render() {

        return(

            <div
                className='clouds'
                style={{
                    top: '50%'
                    }}>

                <i
                    className='fa fa-cloud'
                    style={{
                        fontSize: '100px',
                        color: 'red',
                        transform: 'translateX(-100px) translateY(-50%) scale(1.2) rotateY(180deg)'
                        }}>
                </i>

            </div>
        )
    }
}

export default Cloud
