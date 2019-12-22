import React from 'react'
//import stylesheet, style and annotate this component

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
                <div style={{backgroundColor: 'rgba(225,225,225,.3)', height: 200, width: 200, position: 'absolute'}}>

                    <form onSubmit={this.handleSubmit}>

                        <input type='email' name='email' value={this.state.email} onChange={this.handleChange.bind(this, 'email')} placeholder='email'/>

                        <input type='text' name='firstName' value={this.state.firstName} onChange={this.handleChange.bind(this, 'firstName')} placeholder='first name'/>

                        <input type='text' name='lastName' value={this.state.lastName} onChange={this.handleChange.bind(this, 'lastName')} placeholder='last name'/>

                        <input type='text' name='subject' value={this.state.subject} onChange={this.handleChange.bind(this, 'subject')} placeholder='subject'/>

                        <input type='textarea' name='message' value={this.state.message} onChange={this.handleChange.bind(this, 'message')}/>

                        <input type="button" value="Send" onClick={this.handleSubmit} />

                    </form>

                </div>
            )
        }

}

export default ContactForm
