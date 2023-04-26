describe('Test initial page load', () => {
	it('Can load the page with a map', () => {
		cy.visit('http://sundaypeak.local:3000')
		cy.contains('Create an Account')
		cy.contains('Log In')
		cy.contains('Adventures')
		cy.get('[data-testid="map-container"]')
	})
})
