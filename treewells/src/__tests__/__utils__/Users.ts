import { fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

export const fillForm = (): void => {
	const firstNameInput = screen.getByTestId('first-name')
	const lastNameInput = screen.getByTestId('last-name')
	const emailInput = screen.getByTestId('email')
	const passwordInput = screen.getByTestId('password')
	const password2Input = screen.getByTestId('password-2')

	fireEvent.change(firstNameInput, { target: { value: 'Jimi' } })
	fireEvent.change(lastNameInput, { target: { value: 'Hendrix' } })
	fireEvent.change(emailInput, { target: { value: 'jimi@guitarHero.com' } })
	fireEvent.change(passwordInput, { target: { value: 'guitar' } })
	fireEvent.change(password2Input, { target: { value: 'guitar' } })
}
