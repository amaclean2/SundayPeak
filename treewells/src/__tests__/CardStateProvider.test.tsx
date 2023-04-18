import React from 'react'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import { mockFetch } from '../setupJest'
import { CardTestApp } from '../__mocks__/TestApp'

describe('testing the card state provider', () => {
	beforeEach(() => {
		mockFetch.mockClear()
	})
	afterEach(cleanup)

	test('Image link gets set to the gallery', async () => {
		render(<CardTestApp />)
		expect(screen.getByText(/Gallery image link/i).textContent).toBe('Gallery image link: ')

		const setGalleryButton = screen.getByText(/Set Gallery Image/i)
		fireEvent.click(setGalleryButton)

		expect(screen.getByText(/Gallery image link/i).textContent).toBe(
			'Gallery image link: https://newImage.com'
		)
	})

	test('Open alert sets the alert state and an alert', async () => {
		render(<CardTestApp />)
		expect(screen.getByText(/Alert state view/i).textContent).toBe('Alert state view: false')
		expect(screen.getByText(/Alert content view/i).textContent).toBe('Alert content view: ')

		const setAlertButton = screen.getByText(/Open Alert/i)
		fireEvent.click(setAlertButton)

		expect(screen.getByText(/Alert state view/i).textContent).toBe('Alert state view: true')
		expect(screen.getByText(/Alert content view/i).textContent).toBe(
			'Alert content view: A New Alert'
		)
	})

	test('Close alert clears the content and reverts the alert state', async () => {
		render(<CardTestApp />)

		const setAlertButton = screen.getByText(/Open Alert/i)
		fireEvent.click(setAlertButton)

		expect(screen.getByText(/Alert state view/i).textContent).toBe('Alert state view: true')
		expect(screen.getByText(/Alert content view/i).textContent).toBe(
			'Alert content view: A New Alert'
		)

		const closeAlertButton = screen.getByText(/Close Alert/i)
		fireEvent.click(closeAlertButton)

		expect(screen.getByText(/Alert state view/i).textContent).toBe('Alert state view: false')
		expect(screen.getByText(/Alert content view/i).textContent).toBe('Alert content view: ')
	})

	test('Closing a card with a message shows the message', async () => {
		render(<CardTestApp />)
		expect(screen.getByText(/Alert state view/i).textContent).toBe('Alert state view: false')
		expect(screen.getByText(/Alert content view/i).textContent).toBe('Alert content view: ')

		const closeCardButton = screen.getByText(/Close Card/i)
		fireEvent.click(closeCardButton)

		expect(screen.getByText(/Alert state view/i).textContent).toBe('Alert state view: true')
		expect(screen.getByText(/Alert content view/i).textContent).toBe(
			'Alert content view: The card was closed'
		)
	})
})
