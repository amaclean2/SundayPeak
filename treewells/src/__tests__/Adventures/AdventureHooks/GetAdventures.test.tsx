import React from 'react'
import { render, cleanup, waitFor, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { mockFetch } from '../../../setupJest'
import GetAdventuresTestWrapper from '../../../__mocks__/Adventures/AdventureHooks/GetAdventuresTestComponent'

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

	render(<GetAdventuresTestWrapper />)

	await waitFor(() => {
		expect(mockFetch).toHaveBeenCalledTimes(2)
	})
}

describe('testing get adventures hooks', () => {
	beforeEach(() => {
		mockFetch.mockClear()
		localStorage.clear()
	})
	afterEach(cleanup)

	test('Form fields accept filled in values', async () => {
		await renderApp()

		expect(screen.getByText(/Proof of adventures/i).textContent).toBe(
			'Proof of adventures: FeatureCollection'
		)

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

		const getAdventuresButton = screen.getByText(/Get All Adventures/i)
		fireEvent.click(getAdventuresButton)

		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalledTimes(3)
		})

		expect(mockFetch.mock.calls[2][0]).toContain('?type=climb')
		expect(screen.getByText(/Proof of adventures/i).textContent).toBe(
			'Proof of adventures: FeatureCollection'
		)
	})
})
