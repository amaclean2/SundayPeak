import React from 'react'
import { render, cleanup, waitFor, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { mockFetch } from '../../../setupJest'
import GetAdventuresTestWrapper from '../../../__mocks__/Adventures/AdventureHooks/GetAdventuresTestComponent'
import { mockGetAdventures } from '../../__utils__/Adventures'

const renderApp = async (): Promise<void> => {
	mockFetch.mockResolvedValueOnce({
		json: async () => ({
			data: {
				mapbox_token: '123',
				map_style: 'abc'
			}
		})
	})

	mockFetch.mockResolvedValueOnce({
		json: async () => ({
			data: {
				adventures: {
					climb: {
						type: 'FeatureCollection',
						features: []
					}
				}
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

	test.skip('getAllAdventures populates the new adventure list object to the provider', async () => {
		localStorage.setItem(
			'startPos',
			JSON.stringify({
				lat: 100,
				lng: 20,
				zoom: 10
			})
		)
		localStorage.setItem('globalAdventureType', 'climb')

		await renderApp()

		// the initial getAdventures call is made once the adventureType is set
		expect(screen.getByText(/Proof of adventures/i).textContent).toBe(
			'Proof of adventures: FeatureCollection'
		)
		expect(screen.getByText(/Adventure count/i).textContent).toBe('Adventure count: 0')

		// mock an adventures call with one adventure
		mockGetAdventures()

		const getAdventuresButton = screen.getByText(/Get All Adventures/i)
		fireEvent.click(getAdventuresButton)

		// get the adventure list with the one adventure
		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalledTimes(3)
		})

		const requestObject = mockFetch.mock.lastCall
		const url = requestObject?.shift()

		expect(url).toContain('?type=climb')
		expect(screen.getByText(/Proof of adventures/i).textContent).toBe(
			'Proof of adventures: FeatureCollection'
		)
		// the one adventure is returned in the list
		expect(screen.getByText(/Adventure count/i).textContent).toBe('Adventure count: 1')
	})

	test.skip('a change in globalAdventureType fires a call to update all the adventures', async () => {
		await renderApp()

		expect(screen.getByText(/Proof of adventures/i).textContent).toBe(
			'Proof of adventures: FeatureCollection'
		)
		expect(screen.getByText(/Adventure count/i).textContent).toBe('Adventure count: 0')

		// mock an adventures call with one adventure
		mockGetAdventures()

		const changeAdventureButton = screen.getByText(/Change Adventure Type/i)
		fireEvent.click(changeAdventureButton)

		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalledTimes(3)
		})

		const requestObject = mockFetch.mock.lastCall
		const url = requestObject?.shift()

		expect(url).toContain('?type=hike')
		expect(screen.getByText(/Proof of adventures/i).textContent).toBe(
			'Proof of adventures: FeatureCollection'
		)
		expect(screen.getByText(/Adventure count/i).textContent).toBe('Adventure count: 1')
	})
})
