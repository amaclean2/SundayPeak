const SundayService = require('..')

/**
 * @type {UserObject}
 */
let creator, resetToken

describe('password service layer testing', () => {
  beforeAll(async () => {
    serviceHandler = new SundayService(
      {
        host: 'localhost',
        user: 'byf',
        password: 'backyard',
        database: 'test_passwords',
        port: '3306'
      },
      'secret'
    )

    await serviceHandler.createTables()

    const { user } = await serviceHandler.userService.addNewUser({
      email: 'user@123.com',
      password: 'skiing',
      confirmPassword: 'skiing',
      firstName: 'Jeremy',
      lastName: 'Clarkson'
    })

    creator = user
  })
  afterAll(async () => {
    // adding data to searchable users and searchable adventures happens asynchronously
    // not waiting to delete the tables was deleting the tables before the query could finish
    setTimeout(async () => {
      await serviceHandler.removeTables()
    }, 100)
  })

  test('can get a token from a password rest email', async () => {
    const mockEmailCallback = jest.fn(() => Promise.resolve({ email: '' }))
    const response =
      await serviceHandler.passwordService.sendPasswordResetEmail(
        { email: creator.email },
        mockEmailCallback
      )

    expect(mockEmailCallback).toHaveBeenCalledWith(
      expect.objectContaining({ email: creator.email })
    )

    const params = mockEmailCallback.mock.calls[0][0]

    expect(params.email).toBeDefined()
    expect(params.resetToken).toBeDefined()

    resetToken = params.resetToken

    expect(response).toBe('password reset email sent')
  })

  test('a new password is saved', async () => {
    const newPasswordResponse =
      await serviceHandler.passwordService.saveNewPassword({
        newPassword: 'mangos',
        userId: creator.id,
        resetToken
      })

    expect(newPasswordResponse).toBe('password has been updated')
  })
})
