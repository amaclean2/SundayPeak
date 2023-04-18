import React from 'react'
import '@testing-library/jest-dom'

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { mockFetch } from '../setupJest'
import { AdventureTestApp } from '../__mocks__/TestApp'
import { type AdventureList } from '../Types/Adventures'

const renderApp = async (): Promise<void> => {
	mockFetch.mockResolvedValue({
		json: async () => ({
			data: {}
		})
	})

	render(<AdventureTestApp />)

	await waitFor(() => {
		expect(mockFetch).toHaveBeenCalledTimes(1)
	})
}

describe('testing the adventure state provider', () => {
	beforeEach(() => {
		mockFetch.mockClear()
	})

	afterEach(() => {
		cleanup()
		localStorage.clear()
	})

	test('Getting all the adventues shows up', async () => {
		await renderApp()
		expect(screen.getByText(/Proof of all the/i).textContent).toBe('Proof of all the adventures: ')
		expect(screen.getByText(/Proof of adventure count/i).textContent).toBe(
			'Proof of adventure count: '
		)

		const getAdventuresButton = screen.getByText(/Get All Adventures/i)
		fireEvent.click(getAdventuresButton)

		expect(screen.getByText(/Proof of all the/i).textContent).toBe(
			'Proof of all the adventures: FeatureCollection'
		)
		expect(screen.getByText(/Proof of adventure count/i).textContent).toBe(
			'Proof of adventure count: 0'
		)
	})

	test('Setting a current adventure shows up', async () => {
		await renderApp()
		expect(screen.getByText(/Proof of a current adventure/i).textContent).toBe(
			'Proof of a current adventure: '
		)

		const addCurrentAdventureButton = screen.getByText(/Get Current Adventure/i)
		fireEvent.click(addCurrentAdventureButton)

		expect(screen.getByText(/Proof of a current adventure/i).textContent).toBe(
			'Proof of a current adventure: New Adventure'
		)
	})

	test('Can set adventure errors', async () => {
		await renderApp()
		expect(screen.getByText(/Display adventure error/i).textContent).toBe(
			'Display adventure error: '
		)

		const setAdventureErrorButton = screen.getByText(/Set Adventure Error/i)
		fireEvent.click(setAdventureErrorButton)

		expect(screen.getByText(/Display adventure error/i).textContent).toBe(
			'Display adventure error: New Adventure Error'
		)
	})

	test('Can update the start position', async () => {
		await renderApp()
		expect(screen.getByText(/Start position view/i).textContent).toBe('Start position view: ')

		const setAdventureErrorButton = screen.getByText(/Update Start Position/i)
		fireEvent.click(setAdventureErrorButton)

		expect(screen.getByText(/Start position view/i).textContent).toBe('Start position view: 3')
		expect(localStorage.getItem('startPos')).toContain('"zoom":3')
	})

	test('Can update the adventure type', async () => {
		await renderApp()
		expect(screen.getByText(/Adventure type view/i).textContent).toBe('Adventure type view: ski')

		const setAdventureTypeButton = screen.getByText(/Update Adventure Type/i)
		fireEvent.click(setAdventureTypeButton)

		expect(screen.getByText(/Adventure type view/i).textContent).toBe('Adventure type view: climb')
	})

	test('Can set initial values', async () => {
		await renderApp()
		expect(screen.getByText(/Adventure type view/i).textContent).toBe('Adventure type view: ski')
		expect(screen.getByText(/Start position view/i).textContent).toBe('Start position view: ')

		const initialValuesButton = screen.getByText(/Update Initial Values/i)
		fireEvent.click(initialValuesButton)

		expect(screen.getByText(/Adventure type view/i).textContent).toBe('Adventure type view: hike')
		expect(screen.getByText(/Start position view/i).textContent).toBe('Start position view: 12')
		expect(localStorage.getItem('startPos')).toContain('"zoom":12')
	})

	test('Can edit an adventure', async () => {
		await renderApp()
		expect(screen.getByText(/Proof of a current adventure/i).textContent).toBe(
			'Proof of a current adventure: '
		)

		const addCurrentAdventureButton = screen.getByText(/Get Current Adventure/i)
		fireEvent.click(addCurrentAdventureButton)

		expect(screen.getByText(/Proof of a current adventure/i).textContent).toBe(
			'Proof of a current adventure: New Adventure'
		)

		const adventureNameEdit = screen.getByTestId('adventure-edit')
		fireEvent.change(adventureNameEdit, { target: { value: 'Old Adventure' } })

		expect(screen.getByText(/Proof of a current adventure/i).textContent).toBe(
			'Proof of a current adventure: Old Adventure'
		)
	})

	test('Can add a new adventure', async () => {
		await renderApp()
		expect(screen.getByText(/Proof of adventure count/i).textContent).toBe(
			'Proof of adventure count: '
		)
		expect(screen.getByText(/Proof of all the adventures/i).textContent).toBe(
			'Proof of all the adventures: '
		)

		const getAllAdventuresButton = screen.getByText(/Get All Adventures/i)
		const addNewAdventureButton = screen.getByText(/Add New Adventure/i)

		fireEvent.click(getAllAdventuresButton)

		expect(screen.getByText(/Proof of adventure count/i).textContent).toBe(
			'Proof of adventure count: 0'
		)

		expect(screen.getByText(/Proof of all the adventures/i).textContent).toBe(
			'Proof of all the adventures: FeatureCollection'
		)

		expect(screen.getByText(/Proof of a current adventure/i).textContent).toBe(
			'Proof of a current adventure: '
		)

		fireEvent.click(addNewAdventureButton)

		expect(screen.getByText(/Proof of adventure count/i).textContent).toBe(
			'Proof of adventure count: 1'
		)

		expect(screen.getByText(/Proof of a current adventure/i).textContent).toBe(
			'Proof of a current adventure: My Adventure'
		)
	})

	test('Can start a new adventure process', async () => {
		await renderApp()

		expect(screen.getByText(/Adventure add state view/i).textContent).toBe(
			'Adventure add state view: false'
		)
		expect(screen.getByText(/Adventure type view/i).textContent).toBe('Adventure type view: ski')

		const newAdventureButton = screen.getByText(/Start New Adventure Process/i)
		fireEvent.click(newAdventureButton)

		expect(screen.getByText(/Adventure add state view/i).textContent).toBe(
			'Adventure add state view: true'
		)
		expect(screen.getByText(/Adventure type view/i).textContent).toBe('Adventure type view: hike')
	})

	test('Initial call to get all adventures gets a list of adventures', async () => {
		mockFetch.mockResolvedValue({
			json: async () => ({
				data: {
					adventures: {
						type: 'FeatureCollection',
						features: [
							{
								type: 'Feature',
								geometry: {
									type: 'Point',
									coordinates: [5, 10]
								},
								properties: {
									adventure_name: 'My Adventure',
									adventure_type: 'ski',
									id: 1,
									public: true
								}
							}
						]
					} as AdventureList
				}
			})
		})
		render(<AdventureTestApp />)

		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalledTimes(1)
		})
		expect(mockFetch.mock.calls[0][0]).toContain('/adventures/all?type=ski')
		expect(screen.getByText(/Proof of all the adventures/i).textContent).toBe(
			'Proof of all the adventures: FeatureCollection'
		)
	})

	test('Initial call to get the starting position populates the startPos', async () => {
		localStorage.setItem(
			'startPos',
			JSON.stringify({
				latitude: 100,
				longitude: 20,
				zoom: 10
			})
		)
		localStorage.setItem('globalAdventureType', 'hike')

		render(<AdventureTestApp />)
		await waitFor(() => {
			expect(screen.getByText(/Start position view/i).textContent).toBe('Start position view: 10')
		})
		expect(screen.getByText(/Adventure type view/i).textContent).toBe('Adventure type view: hike')
	})

	test('The map can be enabled for adding a new adventure', async () => {
		await renderApp()

		expect(screen.getByText(/Adventure add state view/i).textContent).toBe(
			'Adventure add state view: false'
		)

		const enableMapButton = screen.getByText(/Enable Double Click/i)
		fireEvent.click(enableMapButton)

		expect(screen.getByText(/Adventure add state view/i).textContent).toBe(
			'Adventure add state view: true'
		)
	})

	test('Adventure edit toggle switches states', async () => {
		await renderApp()

		expect(screen.getByText(/Adventure edit state view/i).textContent).toBe(
			'Adventure edit state view: false'
		)

		const toggleEditButton = screen.getByText(/Change Adventure Edit State/i)
		fireEvent.click(toggleEditButton)

		expect(screen.getByText(/Adventure edit state view/i).textContent).toBe(
			'Adventure edit state view: true'
		)
	})

	test(`closing the adventure view disables the add state,
		sets the current adventure to null, and disables the edit state`, async () => {
		await renderApp()

		const enableMapButton = screen.getByText(/Enable Double Click/i)
		const closeAdventureButton = screen.getByText(/Close Adventure View/i)
		const currentAdventureButton = screen.getByText(/Get Current Adventure/i)
		const toggleEditButton = screen.getByText(/Change Adventure Edit State/i)
		fireEvent.click(toggleEditButton)
		fireEvent.click(enableMapButton)
		fireEvent.click(currentAdventureButton)

		expect(screen.getByText(/Adventure add state view/i).textContent).toBe(
			'Adventure add state view: true'
		)
		expect(screen.getByText(/Proof of a current adventure/i).textContent).toBe(
			'Proof of a current adventure: New Adventure'
		)
		expect(screen.getByText(/Adventure edit state view/i).textContent).toBe(
			'Adventure edit state view: true'
		)

		fireEvent.click(closeAdventureButton)

		expect(screen.getByText(/Adventure add state view/i).textContent).toBe(
			'Adventure add state view: false'
		)
		expect(screen.getByText(/Proof of a current adventure/i).textContent).toBe(
			'Proof of a current adventure: '
		)
		expect(screen.getByText(/Adventure edit state view/i).textContent).toBe(
			'Adventure edit state view: false'
		)
	})
})
