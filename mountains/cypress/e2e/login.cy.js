describe('Testing the login flow for the user', () => {
	it('Logs in a user and performs some actions', () => {
		cy.visit('http://sundaypeak.local:3000')
		cy.contains('Log In').click()

		// log in form
		cy.url().should('include', '/login')
		cy.get('[data-testid="email"]').type('rob@surfing.com')
		cy.get('[data-testid="password"]').type('surfing')

		cy.contains('Log In').click()

		// view profile
		cy.contains('Profile').click()
		cy.contains('Rob Machado')

		// edit the user
		cy.get('[data-testid="menu-opener"]').click()
		cy.contains('Edit User').click()
		// cy.get('input[placeholder="City, State"]').type('San Diego, California')
		cy.contains('Finish').click()

		// show the user was edited
		cy.contains('San Diego, California')

		// show the stats cards
		cy.contains('Completed')
		cy.contains('Friends').click()
		cy.get('input[placeholder="Find New Friends"]')
		cy.get('[data-testid="display-back-button"]').click()

		// adventures view
		cy.contains('Adventures').click()
		cy.contains('Add a New Adventure').click()
		cy.get('[data-testid="adventure-type-selector"]').select('ski')
	})
})
