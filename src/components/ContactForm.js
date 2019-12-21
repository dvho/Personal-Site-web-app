import React from 'react'
import '../App.css'

class ContactForm extends React.PureComponent {
    constructor() {
        super()
        this.state = {

        }
    }

    render() {

        return(
            <div style={{position: 'absolute', height: 500, width: 500, backgroundColor: 'rgba(255,255,255,.3)'}}>
                <form action='../../php/contactform.php' method='post'>
                    <input type='text' name='name' placeholder='Full Name'/>
                    <input type='text' name='mail' placeholder='Email'/>
                    <input type='text' name='subject' placeholder='Subject'/>
                    <textarea name='message' placeholder='Message'></textarea>
                    <button type='submit' name='submit'>Send Mail</button>
                </form>
            </div>
        )
    }
}

export default ContactForm
