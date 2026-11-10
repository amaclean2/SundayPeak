import React from 'react'
import { render, cleanup, waitFor, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { mockFetch } from '../../../setupJest'
import ResetPasswordTestWrapper from '../../../__mocks__/Users/UserHooks/ResetPasswordTestComponent'

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

	render(<ResetPasswordTestWrapper />)

	await waitFor(() => {
		expect(mockFetch).toHaveBeenCalledTimes(3)
	})
}

describe.skip('testing reset password hooks', () => {
	beforeEach(() => {
		mockFetch.mockClear()
		localStorage.clear()
	})
	afterEach(cleanup)

	test('Send password link sends a request to the reset link api', async () => {
		await renderApp()

		const emailField = screen.getByTestId('email')
		const resetPasswordButton = screen.getByText(/Reset Password/i)

		mockFetch.mockResolvedValueOnce({
			json: async () => ({})
		})

		fireEvent.change(emailField, { target: { value: 'jimi@guitarHero.com' } })
		fireEvent.click(resetPasswordButton)

		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalledTimes(3)
		})

		const requestObject = mockFetch.mock.lastCall
		const url = requestObject?.shift()
		const requestParams = requestObject?.shift()

		expect(url).toContain('/passwordResetLink')
		expect(requestParams?.body).toBeDefined()

		const parsedBody = JSON.parse(requestParams?.body)

		expect(parsedBody.email).toBe('jimi@guitarHero.com')
	})

	test('Setting a new password sends a request to the update password api', async () => {
		await renderApp()

		const passwordField = screen.getByTestId('password')
		const resetPasswordButton = screen.getByText(/Save Updated Password/i)

		mockFetch.mockResolvedValueOnce({
			json: async () => ({})
		})

		fireEvent.change(passwordField, { target: { value: 'guitar' } })
		fireEvent.click(resetPasswordButton)

		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalledTimes(3)
		})
		const requestObject = mockFetch.mock.lastCall
		const url = requestObject?.shift()
		const requestParams = requestObject?.shift()

		expect(url).toContain('/newPassword')
		expect(requestParams?.body).toBeDefined()

		const parsedBody = JSON.parse(requestParams?.body)

		expect(parsedBody.password).toBe('guitar')
		expect(parsedBody.reset_token).toBe('123')
	})
})
