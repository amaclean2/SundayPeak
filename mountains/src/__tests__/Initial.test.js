import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import App from 'App'
import { Test } from 'Components/test'
import getContent from 'TextContent'

global.fetch = jest.fn(() => Promise.resolve(10))

describe('pre-login content', () => {
	test('renders the map on the screen', async () => {
		await render(<Test />)

		expect(fetch).toHaveBeenCalledTimes(1)
		expect(fetch).toHaveBeenCalledWith(5)
		console.log(fetch.mock.results[0].value)

		// await waitFor(() => screen.findByTestId('map-container'))
		// expect(screen.getByTestId('map-container')).toBeInTheDocument()
	})

	test.skip('login button appears on the screen', async () => {
		render(<App />)

		await waitFor(() => screen.findByTestId('map-container'))

		const loginButton = screen.getByTestId('login-button-adventures')
		expect(loginButton).toBeInTheDocument()
		expect(loginButton).toHaveTextContent(getContent('buttonText.login'))
	})

	test.skip('signup button appears on the screen', async () => {
		render(<App />)

		await waitFor(() => screen.findByTestId('map-container'))

		const signupButton = screen.getByTestId('signup-button-adventures')
		expect(signupButton).toBeInTheDocument()
		expect(signupButton).toHaveTextContent(getContent('buttonText.signup'))
	})

	test.skip('adventure button appears on the screen', async () => {
		render(<App />)

		await waitFor(() => screen.findByTestId('map-container'))

		const adventureButton = screen.getByTestId('button-adventures')
		expect(adventureButton).toBeInTheDocument()
		expect(adventureButton).toHaveTextContent(getContent('buttonText.adventures'))
	})

	test.skip('logo image button appears on the screen', async () => {
		render(<App />)

		await waitFor(() => screen.findByTestId('map-container'))

		const logoButton = screen.getByTestId('home-redirect')
		expect(logoButton).toBeInTheDocument()
	})

	test.skip('adventure menu shows up when adventure button is clicked', async () => {
		render(<App />)

		await waitFor(() => screen.findByTestId('map-container'))

		const adventureButton = screen.getByTestId('button-adventures')
		fireEvent.click(adventureButton)

		await waitFor(() => screen.findByTestId('main-adventure-view'))
		expect(global.window.location.pathname).toContain('/adventure')
		const skiButton = screen.getByTestId('set-ski-adventure-type')
		const climbButton = screen.getByTestId('set-climb-adventure-type')
		const hikeButton = screen.getByTestId('set-hike-adventure-type')
		const adventureSearchField = screen.getByTestId('adventure-search-field')
		const newAdventureButton = screen.queryByTestId('open-new-adventure-menu')

		expect(skiButton).toBeInTheDocument()
		expect(climbButton).toBeInTheDocument()
		expect(hikeButton).toBeInTheDocument()
		expect(adventureSearchField).toBeInTheDocument()

		// the add a new adventure button should only show up if a logged in user is present
		expect(newAdventureButton).not.toBeInTheDocument()
	})
})
