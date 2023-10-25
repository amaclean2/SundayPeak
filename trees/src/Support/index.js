import React, { useState } from 'react'
import '../Privacy/styles.css'

const SupportPage = () => {
  const defaultFormFields = {
    email: '',
    name: '',
    message: ''
  }

  const [formFields, setFormFields] = useState(defaultFormFields)


  return (
    <div className="content-container" id="support-page">
      <article>
					<section className='header-block'>
						<h1>Sunday Peak Support</h1>
					</section>
          <section id="disclaimer">
            <p>Sunday Peak is a small company still building out our platform. For any support questions, please fill out the form below and we will do our best to get back to you.</p>
          </section>
          <section id="support-form">
            <form action={'mailto:andrew@sundaypeak.com'} method='post' encType='text/plain'>
              <label>
                <span>Email</span>
                <input
                  type="text"
                  name="email"
                  placeholder="adventures@sundaypeak.com"
                  value={formFields.email}
                  onChange={(e) => setFormFields({...formFields, email: e.target.value})}
                />
              </label>
              <label>
                <span>Name</span>
                <input
                  type="text"
                  name="name"
                  placeholder="John Muir"
                  value={formFields.name}
                  onChange={(e) => setFormFields({...formFields, name: e.target.value})}
                />
              </label>
              <label>
                <span>Question</span>
                <textarea placeholder="Where can I go on an adventure?" value={formFields.message} onChange={(e) => setFormFields({...formFields, message: e.target.value})}/>
              </label>
              <input type="submit" value="Send" onSubmit={() => setFormFields(defaultFormFields)}/>
            </form>
          </section>
        </article>
    </div>
  )
}

export default SupportPage