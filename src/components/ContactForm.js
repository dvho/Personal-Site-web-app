import React from 'react'
import emailValidator from 'email-validator'
import emailjs from '@emailjs/browser'

// --Setting up email--
//https://github.com/emailjs-com/emailjs-sdk
//https://www.emailjs.com/docs/sdk/send/

class ContactForm extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            formSend: false,
            firstNameValid: null,
            lastNameValid: null,
            emailValid: null,
            firstName: '',
            lastName: '',
            email: '',
            subject: '',
            message: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    animateAndResetForm = () => { //Change any red fields back to white, set this.state.formSend to true for the purposes of a) triggering the inline ternary which changes the className to include either formSendWideAnimation or formSendNarrowAnimation (which are both 2.5s long), and b) displaying the word "Sending..." on the button.
        this.setState({
            formSend: true,
            firstNameValid: null,
            lastNameValid: null,
            emailValid: null
        })
        setTimeout(() => { //Then after 2500ms reset the form to its original state...
            this.setState({
                formSend: false,
                firstName: '',
                lastName: '',
                email: '',
                subject: '',
                message: ''
            })
            this.props.toggleContactForm() //...and toggle the state of revealContactForm in App.js (back to false)
        }, 2500)
    }

    handleSubmit = (e) => {
        e.preventDefault()

        let firstNameValid = /^[A-Z]+$/i.test(this.state.firstName) //Evaluates to either true or false when this.state.firstName is tested in a regex that makes sure there is at least one letter and no non letter characters in the string
        let lastNameValid = /^[A-Z]+$/i.test(this.state.lastName) //Evaluates to either true or false when this.state.firstName is tested in a regex that makes sure there is at least one letter and no non letter characters in the string
        let emailValid = emailValidator.validate(this.state.email) //Evaluates to either true or false when this.state.email is tested in a method on npm package 'email-validator,' which checks for valid email structure

        if (firstNameValid && lastNameValid && emailValid) { //If all three of these fields test as valid then set the templateParams and pass them to emailjs.send()

            let templateParams = {
                from_email: this.state.email,
                from_firstName: this.state.firstName,
                from_lastName: this.state.lastName,
                subject: this.state.subject,
                message_html: this.state.message
            }

            emailjs.send('service_j0tuddh','template_XwZav7A3', templateParams, 'user_cqWwBjugzaX0BXZjXbz8a')
            	.then((response) => {
            	   console.log('SUCCESS!', response.status, response.text)
            	}, (err) => {
            	   console.log('FAILED...', err)
            	})

            // window.emailjs.send( //Old emailjs API's send method worked with the below params and the EmailJS account was linked in the head of index.html
            //     'gmail',
            //     'template_XwZav7A3',
            //     templateParams,
            //     'user_cqWwBjugzaX0BXZjXbz8a'
            // )

            this.animateAndResetForm() // ...then animate the sending of the form and reset it.

        } else { //else setState with the true/false values for each of the three fields which need to be validated which, in turn, displays the field in red if it is invalid.

            this.setState({
                firstNameValid,
                lastNameValid,
                emailValid
            })
        }
    }

    handleChange = (params, e) => { //Binded (bound) locally so as to maintain dynamicism, allowing for both event (character string) and param name
        this.setState({ [params]: e.target.value})
    }

    render() { //Placing a conditional rendering based on this.props.screenWidth === 0 here, as I've done for the other components, causes an unwanted animation of the ContactForm where it is revealed and fades away, otherwise I would have done it exactly as it was done in AudioPlayer.js (my other big class component)

        let right = this.props.wideScreen ? this.props.margin : 0
        let className = this.props.revealContactForm ? (this.state.formSend ? (this.props.wideScreen ? 'form-container form-container-revealed form-send-wide-animation' : 'form-container form-container-revealed form-send-narrow-animation') : 'form-container form-container-revealed') : 'form-container' //Triple nested ternary just for fun: "If this.props.revealContactForm is true, then if this.state.formSend is true, if the screenWidth is more than the canvasWidth (i.e. if this.props.wideScreen is true) run the formSendWideAnimation or else run the formSendNarrowAnimation, else if this.state.formSend is false, just show the form, else if this.props.revealContactForm is false, don't show the form at all."

        return(
            <div className={className} style={{right: right}}>

                <form style={{display: 'flex', flexDirection: 'column'}} onSubmit={this.handleSubmit}>

                    <input className='form-fields' type='text' name='firstName' value={this.state.firstName} onChange={this.handleChange.bind(this, 'firstName')} placeholder='First Name' style={{backgroundColor: this.state.firstNameValid !== null ? (this.state.firstNameValid ? 'rgba(255,255,255,.85)' : 'rgba(255,0,0,.85)') : null}}/>

                    <input className='form-fields' type='text' name='lastName' value={this.state.lastName} onChange={this.handleChange.bind(this, 'lastName')} placeholder='Last Name' style={{backgroundColor: this.state.lastNameValid !== null ? (this.state.lastNameValid ? 'rgba(255,255,255,.85)' : 'rgba(255,0,0,.85)') : null}}/>

                    <input className='form-fields' type='email' name='email' value={this.state.email} onChange={this.handleChange.bind(this, 'email')} placeholder='Email' style={{backgroundColor: this.state.emailValid !== null ? (this.state.emailValid ? 'rgba(255,255,255,.85)' : 'rgba(255,0,0,.85)') : null}}/>

                    <input className='form-fields' type='text' name='subject' value={this.state.subject} onChange={this.handleChange.bind(this, 'subject')} placeholder='Subject'/>

                    <textarea className='form-fields message' type='textarea' name='message' value={this.state.message} onChange={this.handleChange.bind(this, 'message')} placeholder='(Message)'/>

                    <button className='form-fields button' type='button' value='Send' onClick={this.handleSubmit}><span className='button-text'>{this.state.formSend ? 'Sending now...' : 'Send'}</span></button>

                </form>

            </div>
        )
    }
}

export default ContactForm
