import React from 'react'
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

import { mockFetch } from '../setupJest'
import { TokenTestApp } from '../__mocks__/TestApp'

const renderApp = async (): Promise<void> => {
	mockFetch.mockResolvedValue({
		json: async () => ({
			data: {}
		})
	})

	render(<TokenTestApp />)

	await waitFor(() => {
		expect(mockFetch).toHaveBeenCalledTimes(1)
	})
}

describe('testing the token state provider', () => {
	beforeEach(() => {
		mockFetch.mockClear()
	})
	afterEach(cleanup)

	test('Calling the `setTokens` actions sets the tokens', async () => {
		await renderApp()

		expect(screen.getByText(/Mapbox token/i).textContent).toBe('Mapbox token: ')
		expect(screen.getByText(/Mapbox style key/i).textContent).toBe('Mapbox style key: ')

		const setTokensButton = screen.getByText(/Set Initial Tokens/i)
		fireEvent.click(setTokensButton)

		expect(screen.getByText(/Mapbox token/i).textContent).toBe('Mapbox token: 123')
		expect(screen.getByText(/Mapbox style key/i).textContent).toBe('Mapbox style key: 456')
	})

	test('The call for tokens happens when the provider loads', async () => {
		mockFetch.mockResolvedValue({
			json: async () => ({
				data: {
					mapbox_token: 'abc',
					map_style: 'def'
				}
			})
		})

		render(<TokenTestApp />)

		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalledTimes(1)
		})

		expect(screen.getByText(/Mapbox token/i).textContent).toBe('Mapbox token: abc')
		expect(screen.getByText(/Mapbox style key/i).textContent).toBe('Mapbox style key: def')
	})
})
