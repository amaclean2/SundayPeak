import { render, screen } from '@testing-library/react'

import App from 'App'

test('renders a button bar on the screen', () => {
	render(<App />)
	const linkElement = screen.getByTestId('signup-button-adventures')
	expect(linkElement).toBeInTheDocument()
})

test('renders a map placeholder', () => {
	render(<App />)
	const linkElement = screen.getByTestId('map-container-placeholder')
	expect(linkElement).toBeInTheDocument()
})
