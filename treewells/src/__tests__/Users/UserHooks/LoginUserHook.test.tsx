import React from 'react'
import { render, cleanup, waitFor, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { mockFetch } from '../../../setupJest'
import LoginUserTestWrapper from '../../../__mocks__/Users/UserHooks/LoginUserTestComponent'

const renderApp = async (): Promise<void> => {
	mockFetch.mockResolvedValueOnce({
		json: async () => ({
			data: {
				adventures: {
					type: 'FeatureCollection',
					features: []
				}
			}
		})
	})

	mockFetch.mockResolvedValueOnce({
		json: async () => ({
			data: {
				mapbox_token: '123',
				map_style: 'abc'
			}
		})
	})

	render(<LoginUserTestWrapper />)

	await waitFor(() => {
		expect(mockFetch).toHaveBeenCalledTimes(2)
	})
}

describe('testing login user hooks', () => {
	beforeEach(() => {
		mockFetch.mockClear()
		localStorage.clear()
	})
	afterEach(cleanup)

	test('Form fields accept filled in values', async () => {
		await renderApp()

		const emailInput = screen.getByTestId('email')
		const passwordInput = screen.getByTestId('password')

		fireEvent.change(emailInput, { target: { value: 'jimi@guitarHero.com' } })
		fireEvent.change(passwordInput, { target: { value: 'guitar' } })

		expect(screen.getByText(/email/i).textContent).toBe('email value: jimi@guitarHero.com')
		expect(screen.getByText(/password/i).textContent).toBe('password value: guitar')
	})

	test('User can be logged in from the form fields', async () => {
		await renderApp()

		mockFetch.mockResolvedValueOnce({
			json: async () => ({
				data: {
					user: {
						first_name: 'Jimi',
						last_name: 'Hendrix',
						email: 'jimi@guitarHero.com'
					},
					token: 'abc'
				}
			})
		})

		const emailInput = screen.getByTestId('email')
		const passwordInput = screen.getByTestId('password')
		const loginButton = screen.getByText(/Login User/i)

		fireEvent.change(emailInput, { target: { value: 'jimi@guitarHero.com' } })
		fireEvent.change(passwordInput, { target: { value: 'guitar' } })

		expect(screen.getByText(/Logged in user/i).textContent).toBe('Logged in user view: ')

		fireEvent.click(loginButton)

		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalledTimes(3)
		})

		expect(screen.getByText(/Logged in user/i).textContent).toBe('Logged in user view: Jimi')
	})

	test('Local storage token gets set when a user logs in', async () => {
		await renderApp()

		mockFetch.mockResolvedValueOnce({
			json: async () => ({
				data: {
					user: {
						first_name: 'Jimi',
						last_name: 'Hendrix',
						email: 'jimi@guitarHero.com'
					},
					token: 'abc'
				}
			})
		})

		const emailInput = screen.getByTestId('email')
		const passwordInput = screen.getByTestId('password')
		const loginButton = screen.getByText(/Login User/i)

		fireEvent.change(emailInput, { target: { value: 'jimi@guitarHero.com' } })
		fireEvent.change(passwordInput, { target: { value: 'guitar' } })

		expect(localStorage.getItem('token')).toBeNull()

		fireEvent.click(loginButton)

		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalledTimes(3)
		})

		expect(localStorage.getItem('token')).toBe('abc')
	})
})
