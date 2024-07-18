import React, { useState, useMemo } from 'react'

import config from '../_config'
import utils from '../_utils'

const { getStylesClassNamesAndRenderingVariablesForContactForm, updateContactForm, submitContactForm } = utils

const initialState = config.initialStates.contactForm

const ContactForm = ({ dispatch, revealContactForm }) => {

    const [form, setForm] = useState(initialState)

    const { styles, classNames, renderingVariables } = useMemo(() => getStylesClassNamesAndRenderingVariablesForContactForm(revealContactForm, form), [revealContactForm, form]) //Memoize calls to utils.getStylesClassNamesAndRenderingVariablesForContactForm to prevent the otherwise rapid unnecessary rerenders that would come from the coords changing in Home.js. Note, the coords prop is not even passed to ContactForm but, unlike a couple of the other components' visibilities which are handled by booleans from directly within the markup of Home.js where the pattern    { isVisible ? <Component props={props} /> : null }    is implemented, ContactForm's visibility is handled from within ContactForm itself with revealContactForm, so to prevent unnecessary rerenders from coords in Home.js the calls to utils.getStylesClassNamesAndRenderingVariablesForContactForm must be memoized

    return(
        <div className={classNames.formContainer} style={styles.formContainer}>

            <form style={{display: 'flex', flexDirection: 'column'}} onSubmit={e => submitContactForm(e, dispatch, form, setForm)}>

                <input className='form-fields' type='text' name='firstName' value={form.firstName} onChange={e => updateContactForm(e, 'firstName', form, setForm)} placeholder='First Name' style={styles.firstNameField} />

                <input className='form-fields' type='text' name='lastName' value={form.lastName} onChange={e => updateContactForm(e, 'lastName', form, setForm)} placeholder='Last Name' style={styles.lastNameField} />

                <input className='form-fields' type='email' name='email' value={form.email} onChange={e => updateContactForm(e, 'email', form, setForm)} placeholder='Email' style={styles.emailField} />

                <input className='form-fields' type='text' name='subject' value={form.subject} onChange={e => updateContactForm(e, 'subject', form, setForm)} placeholder='Subject' />

                <textarea className='form-fields message' type='textarea' name='message' value={form.message} onChange={e => updateContactForm(e, 'message', form, setForm)} placeholder='(Message)' />

                <button className='form-fields button' type='button' value='Send' onClick={e => submitContactForm(e, dispatch, form, setForm)}>
                    <span className='button-text'>{renderingVariables.sendButtonText}</span>
                </button>

            </form>

        </div>
    )

}

export default ContactForm
