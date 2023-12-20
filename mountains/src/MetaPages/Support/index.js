import React, { useState } from 'react'
import '../Privacy/styles.css'
import { fetcher, useTokenStateContext } from '@amaclean2/sundaypeak-treewells'

const SupportPage = () => {
	const { githubIssueToken } = useTokenStateContext()
	const initialFormData = {
		title: '',
		content: '',
		email: '',
		name: ''
	}
	const [formData, setFormData] = useState(initialFormData)
	const [formError, setFormError] = useState(null)
	const [formSuccess, setFormSuccess] = useState(false)

	const sendFormData = async () => {
		let shouldReturn = false
		for (const key in formData) {
			switch (key) {
				case 'title':
					if (formData[key].length < 10 || formData[key].lenth > 255) {
						setFormError('Title length out of range. Should be between 10 and 255 characters')
						shouldReturn = true
					}
					break
				case 'content':
					if (formData[key].length < 10 || formData[key].lenth > 1000) {
						setFormError('Title length out of range. Should be between 10 and 1000 characters')
						shouldReturn = true
					}
					break
				case 'email':
				case 'name':
					if (formData[key].length < 5 || formData[key].lenth > 100) {
						setFormError('Title length out of range. Should be between 5 and 100 characters')
						shouldReturn = true
					}
			}
		}

		if (shouldReturn) return

		const response = await fetcher('https://api.github.com/repos/amaclean2/sundaypeak/issues', {
			method: 'POST',
			headers: [
				{ name: 'Accept', value: 'application/vnd.github+json' },
				{ name: 'Authorization', value: `Bearer ${githubIssueToken}` },
				{ name: 'X-GitHub-Api-Version', value: '2022-11-28' }
			],
			body: {
				owner: 'amaclean2',
				repo: 'SundayPeak',
				title: formData.title,
				body: `${formData.content}\n${formData.email},\n${formData.name}`,
				assignees: ['amaclean2'],
				labels: ['bug', 'outside']
			}
		})

		if (response.url) {
			setFormData(initialFormData)
			setFormSuccess(true)
		}
	}

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
				{formError && <p id='form-error'>{formError}</p>}
				{formSuccess && (
					<p id='form-success'>
						Your issue has been submitted. Please wait for an email confirming your ticket
					</p>
				)}
				<section id='support-form'>
					<label>
						<span>Email</span>
						<input
							type='text'
							name='email'
							id='form-email'
							placeholder='adventures@sundaypeak.com'
							value={formData.email}
							onChange={(event) => {
								setFormData({ ...formData, [event.target.name]: event.target.value })
								setFormError(null)
							}}
						/>
					</label>
					<label>
						<span>Name</span>
						<input
							type='text'
							name='name'
							placeholder='John Muir'
							id='form-name'
							value={formData.name}
							onChange={(event) => {
								setFormData({ ...formData, [event.target.name]: event.target.value })
								setFormError(null)
							}}
						/>
					</label>
					<label>
						<span>Subject</span>
						<input
							type={'text'}
							name={'title'}
							id='form-subject'
							placeholder='Creating new adventures'
							value={formData.title}
							onChange={(event) => {
								setFormData({ ...formData, [event.target.name]: event.target.value })
								setFormError(null)
							}}
						/>
					</label>
					<label>
						<span>Question</span>
						<textarea
							placeholder={`What doesn't work and what do you expect it to do`}
							id='form-body'
							name='content'
							value={formData.content}
							onChange={(event) => {
								setFormData({ ...formData, [event.target.name]: event.target.value })
								setFormError(null)
							}}
						/>
					</label>
					<button
						onClick={sendFormData}
						id='support-submit-button'
					>
						Submit
					</button>
				</section>
			</article>
		</div>
	)
}

export default SupportPage
