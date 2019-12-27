import React from 'react'
import emailValidator from 'email-validator'
import '../App.css'

// --Setting up email--
//https://blog.mailtrap.io/react-send-email/
//https://medium.com/@eesh.t/send-email-using-emailjs-and-react-form-9993bb6929d8

class ContactForm extends React.Component {
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

        if (firstNameValid && lastNameValid && emailValid) { //If all three of these fields test as valid then set the templateParams and pass them to window.emailjs.send(), which sends them to the EmailJS account associated with the app in the head of index.html...

            let templateParams = {
                from_email: this.state.email,
                from_firstName: this.state.firstName,
                from_lastName: this.state.lastName,
                subject: this.state.subject,
                message_html: this.state.message
            }

            window.emailjs.send(
                'gmail',
                'template_QecxrK0s',
                templateParams,
                'user_3NxAPAZEoJuAjalpGeSTP'
            )

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

    render() {

        let right = this.props.canvasWidth < this.props.screenWidth ? this.props.margin : 0
        let className = this.props.revealContactForm ? (this.state.formSend ? (this.props.screenWidth > this.props.canvasWidth ? 'form-container form-container-revealed form-send-wide-animation' : 'form-container form-container-revealed form-send-narrow-animation') : 'form-container form-container-revealed') : 'form-container' //Triple nested ternary just for fun: "If this.props.revealContactForm is true, then if this.state.formSend is true, if the screenWidth is more than the canvasWidth run the formSendWideAnimation or else run the formSendNarrowAnimation, else if this.state.formSend is false, just show the form, else if this.props.revealContactForm is false, don't show the form at all."

        return(
            <div className={className} style={{right: right}}>

                <form style={{display: 'flex', flexDirection: 'column'}} onSubmit={this.handleSubmit}>

                    <input className='form-fields' type='text' name='firstName' value={this.state.firstName} onChange={this.handleChange.bind(this, 'firstName')} placeholder='First Name' style={{backgroundColor: this.state.firstNameValid !== null ? (this.state.firstNameValid ? 'rgba(255,255,255,.85)' : 'rgba(255,0,0,.85)') : null}}/>

                    <input className='form-fields' type='text' name='lastName' value={this.state.lastName} onChange={this.handleChange.bind(this, 'lastName')} placeholder='Last Name' style={{backgroundColor: this.state.lastNameValid !== null ? (this.state.lastNameValid ? 'rgba(255,255,255,.85)' : 'rgba(255,0,0,.85)') : null}}/>

                    <input className='form-fields' type='email' name='email' value={this.state.email} onChange={this.handleChange.bind(this, 'email')} placeholder='Email' style={{backgroundColor: this.state.emailValid !== null ? (this.state.emailValid ? 'rgba(255,255,255,.85)' : 'rgba(255,0,0,.85)') : null}}/>

                    <input className='form-fields' type='text' name='subject' value={this.state.subject} onChange={this.handleChange.bind(this, 'subject')} placeholder='Subject'/>

                    <textarea className='form-fields message' type='textarea' name='message' value={this.state.message} onChange={this.handleChange.bind(this, 'message')} placeholder='(Message)'/>

                    <button className='form-fields button' type="button" value="Send" onClick={this.handleSubmit}><span className='button-text'>{this.state.formSend ? 'Sending now...' : 'Send'}</span></button>

                </form>

            </div>
        )
    }
}

export default ContactForm
