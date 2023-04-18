import React from 'react'
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

import { mockFetch } from '../../setupJest'
import { UserTestApp } from '../../__mocks__/TestApp'

describe('testing the user state provider', () => {
	beforeEach(() => {
		mockFetch.mockClear()
	})
	afterEach(cleanup)

	test('The login error value should not be defined', async () => {
		render(<UserTestApp />)
		expect(screen.getByText(/Any errors here/i).textContent).toBe('Any errors here: ')
	})

	test('Setting a login error should show up', async () => {
		render(<UserTestApp />)
		const errorButton = screen.getByText(/Trigger Error/i)
		fireEvent.click(errorButton)

		expect(screen.getByText(/Any errors here/i).textContent).toBe(
			'Any errors here: New Login Error'
		)
	})

	test('The initial working user should be null', async () => {
		render(<UserTestApp />)
		expect(screen.getByText(/Working username/i).textContent).toBe('Working username: ')
	})

	test('Adding a working user should load that user', async () => {
		render(<UserTestApp />)
		const newUserButton = screen.getByText(/Add Working User/i)
		fireEvent.click(newUserButton)

		expect(screen.getByText(/Working username/i).textContent).toBe('Working username: Yvonne')
	})

	test('The initial logged in user should be null', async () => {
		render(<UserTestApp />)
		expect(screen.getByText(/Logged in username/i).textContent).toBe('Logged in username: ')
	})

	test('Adding a logged in user should load that user', async () => {
		render(<UserTestApp />)
		const newUserButton = screen.getByText(/Add Logged in User/i)
		fireEvent.click(newUserButton)

		expect(screen.getByText(/Logged in username/i).textContent).toBe('Logged in username: Doug')
	})

	test('Adding a logged in user should clear any login errors', async () => {
		render(<UserTestApp />)
		const newUserButton = screen.getByText(/Add Logged in User/i)
		const errorButton = screen.getByText(/Trigger Error/i)
		fireEvent.click(errorButton)

		expect(screen.getByText(/Any errors here/i).textContent).toBe(
			'Any errors here: New Login Error'
		)

		fireEvent.click(newUserButton)

		expect(screen.getByText(/Any errors here/i).textContent).toBe('Any errors here: ')
	})

	test('Adding a logged in user should set the working user to the logged in user', async () => {
		render(<UserTestApp />)
		const newUserButton = screen.getByText(/Add Working User/i)
		const loginUserButton = screen.getByText(/Add Logged in User/i)
		fireEvent.click(newUserButton)

		expect(screen.getByText(/Working username/i).textContent).toBe('Working username: Yvonne')

		fireEvent.click(loginUserButton)

		expect(screen.getByText(/Logged in username/i).textContent).toBe('Logged in username: Doug')
	})

	test('Adding text to the form fields should show up', async () => {
		render(<UserTestApp />)
		expect(screen.getByText(/Form fields name/i).textContent).toBe('Form fields name: ')

		const formFieldInput = screen.getByTestId('form-field-input')
		fireEvent.change(formFieldInput, { target: { value: 'Alain' } })

		expect(screen.getByText(/Form fields name/i).textContent).toBe('Form fields name: Alain')
	})

	test('Adding text to the form fields should clear any errors', async () => {
		render(<UserTestApp />)
		const errorButton = screen.getByText(/Trigger Error/i)
		fireEvent.click(errorButton)

		expect(screen.getByText(/Any errors here/i).textContent).toBe(
			'Any errors here: New Login Error'
		)

		const formFieldInput = screen.getByTestId('form-field-input')
		fireEvent.change(formFieldInput, { target: { value: 'Alain' } })

		expect(screen.getByText(/Any errors here/i).textContent).toBe('Any errors here: ')
	})

	test('updating user fields should update the logged in user', async () => {
		render(<UserTestApp />)
		const newUserButton = screen.getByText(/Add Logged in User/i)
		const toggleFormFieldButton = screen.getByText(/Toggle Form Field/i)

		fireEvent.click(toggleFormFieldButton)
		fireEvent.click(newUserButton)

		expect(screen.getByText(/Logged in username/i).textContent).toBe('Logged in username: Doug')

		const formFieldInput = screen.getByTestId('form-field-input')
		fireEvent.change(formFieldInput, { target: { value: 'Alain' } })

		expect(screen.getByText(/Logged in username/i).textContent).toBe('Logged in username: Alain')
		expect(screen.getByText(/Form fields name/i).textContent).toBe('Form fields name: Alain')
	})

	test('updating user fields should update the working user', async () => {
		render(<UserTestApp />)
		const newUserButton = screen.getByText(/Add Working User/i)
		const toggleFormFieldButton = screen.getByText(/Toggle Form Field/i)

		fireEvent.click(toggleFormFieldButton)
		fireEvent.click(newUserButton)

		expect(screen.getByText(/Working username/i).textContent).toBe('Working username: Yvonne')

		const formFieldInput = screen.getByTestId('form-field-input')
		fireEvent.change(formFieldInput, { target: { value: 'Alain' } })

		expect(screen.getByText(/Working username/i).textContent).toBe('Working username: Alain')
		expect(screen.getByText(/Form fields name/i).textContent).toBe('Form fields name: Alain')
	})

	test('Clicking clear form clears the form', async () => {
		render(<UserTestApp />)
		expect(screen.getByText(/Form fields name/i).textContent).toBe('Form fields name: ')

		const formFieldInput = screen.getByTestId('form-field-input')
		fireEvent.change(formFieldInput, { target: { value: 'Alain' } })

		expect(screen.getByText(/Form fields name/i).textContent).toBe('Form fields name: Alain')

		const clearFormButton = screen.getByText(/Clear Form/i)
		fireEvent.click(clearFormButton)

		expect(screen.getByText(/Form fields name/i).textContent).toBe('Form fields name: ')
	})

	test('click logout clears the user', async () => {
		render(<UserTestApp />)
		const newUserButton = screen.getByText(/Add Logged in User/i)
		const logoutButton = screen.getByText(/Logout/i)
		fireEvent.click(newUserButton)

		expect(screen.getByText(/Logged in username/i).textContent).toBe('Logged in username: Doug')
		fireEvent.click(logoutButton)

		expect(screen.getByText(/Logged in username/i).textContent).toBe('Logged in username: ')
		expect(localStorage.token).not.toBeDefined()
	})

	test('switchIsUserEditable switches the edit state', async () => {
		render(<UserTestApp />)
		expect(screen.getByText(/Is user editable/i).textContent).toBe('Is user editable: false')

		const switchEditButton = screen.getByText(/Switch Edit State/i)
		fireEvent.click(switchEditButton)

		expect(screen.getByText(/Is user editable/i).textContent).toBe('Is user editable: true')
	})

	test('The user is fetched from the token if one is present in localStorage', async () => {
		localStorage.setItem('token', '123')
		mockFetch.mockResolvedValue({
			json: async () => ({
				data: {
					user: {
						first_name: 'Doug',
						last_name: 'Thompkins',
						email: 'doug@thenorthface.com',
						bio: '',
						todo_adventures: [],
						completed_adventures: []
					}
				}
			})
		})
		render(<UserTestApp />)

		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalledTimes(1)
		})
		expect(mockFetch.mock.calls[0][0]).toContain('/users/loggedIn')
		expect(screen.getByText(/Logged in username/i).textContent).toBe('Logged in username: Doug')
	})

	test('An attempt is made to fetch a user with an expired token', async () => {
		localStorage.setItem('token', '123')
		mockFetch.mockResolvedValue({
			json: async () => ({
				data: {}
			})
		})

		render(<UserTestApp />)

		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalledTimes(1)
		})
		expect(mockFetch.mock.calls[0][0]).toContain('/users/loggedIn')
		expect(localStorage.getItem('token')).toBeNull()
	})
})
