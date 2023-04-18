import React from 'react'
import { render, cleanup, waitFor, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { mockFetch } from '../../../setupJest'

import { fillForm } from '../../__utils__/Users'
import CreateUserTestWrapper from '../../../__mocks__/Users/UserHooks/CreateUserTestComponent'

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

	render(<CreateUserTestWrapper />)

	await waitFor(() => {
		expect(mockFetch).toHaveBeenCalledTimes(2)
	})
}

describe('testing create user hooks', () => {
	beforeEach(() => {
		mockFetch.mockClear()
		localStorage.clear()
	})
	afterEach(cleanup)

	test('Form fields accept filled in values', async () => {
		await renderApp()

		fillForm()

		expect(screen.getByText(/first_name/i).textContent).toBe('first_name value: Jimi')
		expect(screen.getByText(/last_name/i).textContent).toBe('last_name value: Hendrix')
		expect(screen.getByText(/email/i).textContent).toBe('email value: jimi@guitarHero.com')
		expect(screen.getByText(/password_2/i).textContent).toBe('password_2 value: guitar')
	})

	test('Create User creates a user with the filled in values', async () => {
		await renderApp()
		mockFetch.mockResolvedValueOnce({
			json: async () => ({
				data: {
					user: {
						first_name: 'Jimi',
						last_name: 'Hendrix',
						email: 'jimi@guitarHero.com'
					},
					token: '123'
				}
			})
		})

		fillForm()

		const createUserButton = screen.getByText(/Create New User/i)
		fireEvent.click(createUserButton)

		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalledTimes(3)
		})
	})

	test('Alert shows when a user is created', async () => {
		await renderApp()

		mockFetch.mockResolvedValueOnce({
			json: async () => ({
				data: {
					user: {
						first_name: 'Jimi',
						last_name: 'Hendrix',
						email: 'jimi@guitarHero.com'
					},
					token: '123'
				}
			})
		})

		fillForm()

		expect(screen.getByText(/Alert is shown/i).textContent).toBe('Alert is shown: false')

		const createUserButton = screen.getByText(/Create New User/i)
		fireEvent.click(createUserButton)

		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalledTimes(3)
		})

		expect(screen.getByText(/Alert content view/i).textContent).toBe(
			'Alert content view: User Jimi Hendrix created!\nGet started with a new adventure.'
		)
		expect(screen.getByText(/Alert is shown/i).textContent).toBe('Alert is shown: true')
	})

	test('A logged in user is set when the user is created', async () => {
		await renderApp()

		mockFetch.mockResolvedValueOnce({
			json: async () => ({
				data: {
					user: {
						first_name: 'Jimi',
						last_name: 'Hendrix',
						email: 'jimi@guitarHero.com'
					},
					token: '123'
				}
			})
		})

		fillForm()

		expect(screen.getByText(/Logged in user/i).textContent).toBe('Logged in user view: ')

		const createUserButton = screen.getByText(/Create New User/i)
		fireEvent.click(createUserButton)

		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalledTimes(3)
		})

		expect(screen.getByText(/Logged in user/i).textContent).toBe('Logged in user view: Jimi')
	})

	test('A token is set in localStorage when a user is created', async () => {
		await renderApp()

		mockFetch.mockResolvedValueOnce({
			json: async () => ({
				data: {
					user: {
						first_name: 'Jimi',
						last_name: 'Hendrix',
						email: 'jimi@guitarHero.com'
					},
					token: '123'
				}
			})
		})

		fillForm()

		expect(localStorage.getItem('token')).toBeNull()

		const createUserButton = screen.getByText(/Create New User/i)
		fireEvent.click(createUserButton)

		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalledTimes(3)
		})

		expect(localStorage.getItem('token')).toBe('123')
	})
})
