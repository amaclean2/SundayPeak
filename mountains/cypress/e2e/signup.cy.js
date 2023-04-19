describe('Testing the signup flow for the user', () => {
	it('Creates a user and performs some actions', () => {
		cy.visit('http://sundaypeak.local:3000')
		cy.contains('Create an Account').click()

		cy.contains('Login to Sunday Peak').click()
		cy.contains('Create a new account').click()

		// sign up form
		cy.url().should('include', '/signup')
		cy.get('input[placeholder="First Name"]').type('Rob')
		cy.get('input[placeholder="Last Name"]').type('Machado')
		cy.get('input[placeholder="Email"]').type('rob@surfing.com')
		cy.get('input[placeholder="Password"]').type('surfing')
		cy.get('input[placeholder="Confirm Password"]').type('surfing')
		cy.contains('I agree with the Sunday Peak Privacy Policy').click()

		cy.contains('Create Account').click()

		// alert shows up
		cy.contains('User Rob Machado created!')

		// view profile
		cy.contains('Profile').click()
		cy.contains('Rob Machado')
		cy.get('[data-testid="menu-opener"]').click()
		cy.contains('Logout').click()

		cy.contains('Create an Account')
	})
})
