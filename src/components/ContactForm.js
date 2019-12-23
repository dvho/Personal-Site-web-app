import React from 'react'
import '../App.css'
import config from '../config'

//import stylesheet, style and annotate this component
//Need email validator npm package, or just write my own

// --Setting up email--
//https://blog.mailtrap.io/react-send-email/
//https://medium.com/@eesh.t/send-email-using-emailjs-and-react-form-9993bb6929d8

class ContactForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            subject: '',
            message: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    resetForm = () => {
        this.setState({
            firstName: '',
            lastName: '',
            email: '',
            subject: '',
            message: ''
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()

        const { firstName, lastName, email, subject, message } = this.state

        let templateParams = {
            from_email: email,
            from_firstName: firstName,
            from_lastName: lastName,
            subject: subject,
            message_html: message
        }

        window.emailjs.send(
            'gmail',
            'template_QecxrK0s',
            templateParams,
            'user_3NxAPAZEoJuAjalpGeSTP'
        )

        this.resetForm()
    }

    handleChange = (params, e) => {
        this.setState({ [params]: e.target.value})
    }

    render() { //Column flexbox the contents of this

        return (
            <div style={{position: 'absolute'}}>

                <form style={{display: 'flex', flexDirection: 'column'}} onSubmit={this.handleSubmit}>

                    <input className='formFields' type='text' name='firstName' value={this.state.firstName} onChange={this.handleChange.bind(this, 'firstName')} placeholder='First Name'/>

                    <input className='formFields' type='text' name='lastName' value={this.state.lastName} onChange={this.handleChange.bind(this, 'lastName')} placeholder='Last Name'/>

                    <input className='formFields' type='email' name='email' value={this.state.email} onChange={this.handleChange.bind(this, 'email')} placeholder='Email'/>

                    <input className='formFields' type='text' name='subject' value={this.state.subject} onChange={this.handleChange.bind(this, 'subject')} placeholder='Subject'/>

                    <textarea className='formFields message' type='textarea' name='message' value={this.state.message} onChange={this.handleChange.bind(this, 'message')} placeholder='(Message)'/>

                    <button className='formFields button' type="button" value="Send" onClick={this.handleSubmit}><span className='buttonText'>Send</span></button>

                </form>

            </div>
        )
    }
}

export default ContactForm
