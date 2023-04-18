const { render, screen, fireEvent, waitFor } = require('@testing-library/react')
const { default: App } = require('App')
const { default: getContent } = require('TextContent')

describe.skip('testing the signup flow', () => {
	test('Signup page appears when the create user button is clicked', async () => {
		render(<App />)

		await waitFor(() => screen.findByTestId('map-container'))

		const signupButton = screen.getByTestId('signup-button-adventures')
		expect(signupButton).toBeInTheDocument()
		expect(signupButton).toHaveTextContent(getContent('buttonText.signup'))
		fireEvent.click(signupButton)

		await waitFor(() => screen.findByTestId('signup-page'))

		const fields = [
			'first-name',
			'last-name',
			'email',
			'password',
			'confirm-password',
			'legal-check',
			'create-account-button',
			'switch-to-login-button'
		]

		fields.forEach((field) => {
			expect(screen.getByTestId(field)).toBeInTheDocument()
		})
	})

	test('New user info is sent and a new user is received when the create user flow is finished', async () => {
		render(<App />)

		await waitFor(() => screen.findByTestId('signup-page'))

		fireEvent.change(screen.getByTestId('first-name'), { target: { value: 'Andrew' } })
		fireEvent.change(screen.getByTestId('last-name'), { target: { value: 'Maclean' } })
		fireEvent.change(screen.getByTestId('email'), {
			target: { value: 'andrew.n.maclean@gmail.com' }
		})
		fireEvent.change(screen.getByTestId('password'), { target: { value: 'skiing' } })
		fireEvent.change(screen.getByTestId('confirm-password'), { target: { value: 'skiing' } })
		fireEvent.click(screen.getByTestId('legal-check'))

		fireEvent.click(screen.getByTestId('create-account-button'))

		expect(await screen.getByTestId('signup-page')).toBeInTheDocument()

		// expect(screen.getByTestId('button-adventures')).toBeInTheDocument()
		// await waitFor(() => screen.findByTestId('button-adventures'))
	})
})
