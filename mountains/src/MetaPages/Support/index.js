import React from 'react'
import '../Privacy/styles.css'

const SupportPage = () => {
	return (
		<div
			className='marketing-content-container'
			id='support-page'
		>
			<article>
				<section className='header-block'>
					<h1>Sunday Peak Support</h1>
				</section>
				<section id='disclaimer'>
					<p>
						Sunday Peak is a small company still building out our platform. For any support
						questions, please fill out the form below and we will do our best to get back to you.
					</p>
				</section>
				<section id='support-form'>
					<form>
						<label>
							<span>Email</span>
							<input
								type='text'
								name='email'
								placeholder='adventures@sundaypeak.com'
							/>
						</label>
						<label>
							<span>Name</span>
							<input
								type='text'
								name='name'
								placeholder='John Muir'
							/>
						</label>
						<label>
							<span>Question</span>
							<textarea placeholder='Where can I go on an adventure?' />
						</label>
						<input
							type='submit'
							value='Submit'
						/>
					</form>
				</section>
			</article>
		</div>
	)
}

export default SupportPage
