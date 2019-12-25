import React from 'react'
import emailValidator from 'email-validator'
import '../App.css'

//Annotate this component

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

    animateAndResetForm = () => {
        this.setState({
            formSend: true,
            firstNameValid: null,
            lastNameValid: null,
            emailValid: null
        })
        setTimeout(() => {
            this.setState({
                formSend: false,
                firstName: '',
                lastName: '',
                email: '',
                subject: '',
                message: ''
            })
            this.props.toggleContactForm()
        }, 2500)
    }

    handleSubmit = (e) => {
        e.preventDefault()

        let firstNameValid = /^[A-Z]+$/i.test(this.state.firstName)
        let lastNameValid = /^[A-Z]+$/i.test(this.state.lastName)
        let emailValid = emailValidator.validate(this.state.email)

        if (firstNameValid && lastNameValid && emailValid) {

            let templateParams = {
                from_email: this.state.email,
                from_firstName: this.state.firstName,
                from_lastName: this.state.lastName,
                subject: this.state.subject,
                message_html: this.state.message
            }

            // Uncomment this out when I'm ready to launch

            // window.emailjs.send(
            //     'gmail',
            //     'template_QecxrK0s',
            //     templateParams,
            //     'user_3NxAPAZEoJuAjalpGeSTP'
            // )

            this.animateAndResetForm()

        } else {

            this.setState({
                firstNameValid,
                lastNameValid,
                emailValid
            })
        }
    }

    handleChange = (params, e) => {
        this.setState({ [params]: e.target.value})
    }

    render() {

        console.log(this.state.formSend)

        let right = this.props.canvasWidth < this.props.screenWidth ? this.props.margin : 0
        let revealContactForm = this.props.revealContactForm

        return(
            <div className={revealContactForm ? (this.state.formSend ? "formContainer formContainerRevealed formSendAnimation" : "formContainer formContainerRevealed") : "formContainer"} style={{right: right}}>

                <form style={{display: 'flex', flexDirection: 'column'}} onSubmit={this.handleSubmit}>

                    <input className='formFields' type='text' name='firstName' value={this.state.firstName} onChange={this.handleChange.bind(this, 'firstName')} placeholder='First Name' style={{backgroundColor: this.state.firstNameValid !== null ? (this.state.firstNameValid ? 'rgba(255,255,255,.85)' : 'rgba(255,0,0,.85)') : null}}/>

                    <input className='formFields' type='text' name='lastName' value={this.state.lastName} onChange={this.handleChange.bind(this, 'lastName')} placeholder='Last Name' style={{backgroundColor: this.state.lastNameValid !== null ? (this.state.lastNameValid ? 'rgba(255,255,255,.85)' : 'rgba(255,0,0,.85)') : null}}/>

                    <input className='formFields' type='email' name='email' value={this.state.email} onChange={this.handleChange.bind(this, 'email')} placeholder='Email' style={{backgroundColor: this.state.emailValid !== null ? (this.state.emailValid ? 'rgba(255,255,255,.85)' : 'rgba(255,0,0,.85)') : null}}/>

                    <input className='formFields' type='text' name='subject' value={this.state.subject} onChange={this.handleChange.bind(this, 'subject')} placeholder='Subject'/>

                    <textarea className='formFields message' type='textarea' name='message' value={this.state.message} onChange={this.handleChange.bind(this, 'message')} placeholder='(Message)'/>

                    <button className='formFields button' type="button" value="Send" onClick={this.handleSubmit}><span className='buttonText'>{this.state.formSend ? 'Sending now...' : 'Send'}</span></button>

                </form>

            </div>
        )
    }
}

export default ContactForm
