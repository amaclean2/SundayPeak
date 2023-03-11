const SundayService = require('..')

let serviceHandler, token, userId, secondUserId, newAdventure

describe('user service layer testing', () => {
  beforeAll(async () => {
    serviceHandler = new SundayService(
      {
        host: 'localhost',
        user: 'byf',
        password: 'backyard',
        database: 'test_users',
        port: '3306'
      },
      'secret'
    )

    await serviceHandler.createTables()
  })
  afterAll(async () => {
    // adding data to searchable users and searchable adventures happens asynchronously
    // not waiting to delete the tables was deleting the tables before the query could finish
    setTimeout(async () => {
      await serviceHandler.removeTables()
    })
  })
  describe('user happy paths', () => {
    test('can add a new user', async () => {
      const newUser = await serviceHandler.userService.addNewUser({
        email: 'user@123.com',
        password: 'skiing',
        confirmPassword: 'skiing',
        firstName: 'Jeremy',
        lastName: 'Clarkson'
      })

      expect(newUser.user).toBeDefined()
      expect(newUser.token).toBeDefined()
    })

    test('can log into that user', async () => {
      const response =
        await serviceHandler.userService.loginWithEmailAndPassword({
          email: 'user@123.com',
          password: 'skiing'
        })

      expect(response.user).toBeDefined()
      expect(response.user.friends).toBeDefined()
      expect(response.user.completed_adventures).toBeDefined()
      expect(response.user.todo_adventures).toBeDefined()
      expect(response.user.images).toBeDefined()
      expect(response.token).toBeDefined()

      token = response.token
    })

    test('can return to that user', async () => {
      const response = await serviceHandler.userService.getPresignedInUser({
        url: '/requiredUrl',
        token
      })

      expect(response).toBeDefined()
      expect(response.friends).toBeDefined()
      expect(response.completed_adventures).toBeDefined()
      expect(response.todo_adventures).toBeDefined()
      expect(response.images).toBeDefined()
      expect(response.id).toBeDefined()

      userId = response.id
    })

    test("can get that user by it's id", async () => {
      const response = await serviceHandler.userService.getUserFromId({
        userId
      })

      expect(response).toBeDefined()
      expect(response.friends).toBeDefined()
      expect(response.completed_adventures).toBeDefined()
      expect(response.todo_adventures).toBeDefined()
      expect(response.images).toBeDefined()
    })

    test('can find a list of users from a search string', async () => {
      const response = await serviceHandler.userService.searchForUsers({
        searchString: '@123.com'
      })

      expect(response.length).toBe(1)
      expect(response[0].display_name).toBeDefined()
      expect(response[0].id).toBeDefined()
      expect(response[0].email).toBeDefined()
    })

    test('can follow a different user', async () => {
      const secondUser = await serviceHandler.userService.addNewUser({
        email: 'adam@123.org',
        password: 'economics',
        confirmPassword: 'economics',
        firstName: 'Adam',
        lastName: 'Smith'
      })

      token = secondUser.token
      const mockEmailCallback = jest.fn(() => Promise.resolve({ user: {} }))

      secondUserId = secondUser.user.id

      const updatedSecondUser = await serviceHandler.userService.friendUser(
        {
          leaderId: userId,
          followerId: secondUserId
        },
        mockEmailCallback
      )

      expect(mockEmailCallback).toHaveBeenCalledWith({
        email: 'user@123.com',
        followingUserName: 'Jeremy Clarkson'
      })
      expect(updatedSecondUser.friends.length).toBe(1)
    })

    test('can search for friends', async () => {
      const friends = await serviceHandler.userService.searchForFriends({
        searchString: 'am sm',
        userId
      })

      expect(friends.length).toBe(1)
      expect(friends[0].display_name).toBeDefined()
      expect(friends[0].id).toBeDefined()
    })

    test('can edit a user', async () => {
      const updatedFirstNameField = 'Jimmy'
      await serviceHandler.userService.editUser({
        userId,
        fieldName: 'first_name',
        fieldValue: updatedFirstNameField
      })

      const updatedUser = await serviceHandler.userService.getUserFromId({
        userId
      })

      expect(updatedUser.first_name).toBe(updatedFirstNameField)
    })

    test('can check todo on an adventure', async () => {
      // create an adventure
      const newAdventureResponse =
        await serviceHandler.adventureService.createAdventure({
          adventureObject: {
            adventure_type: 'ski',
            adventure_name: 'Ski Descent',
            nearest_city: 'Truckee, California',
            public: true,
            creator_id: userId,
            coordinates_lat: 10,
            coordinates_lng: 11
          }
        })

      newAdventure = newAdventureResponse.adventure
      const addTodoResponse = await serviceHandler.userService.addAdventureTodo(
        {
          userId,
          adventureId: newAdventure.id,
          isPublic: true
        }
      )

      expect(addTodoResponse.userTodo).toBeDefined()
      expect(addTodoResponse.adventureTodo).toBeDefined()

      const { userTodo, adventureTodo } = addTodoResponse
      expect(userTodo.adventure_name).toBe(newAdventure.adventure_name)
      expect(userTodo.adventure_id).toBe(newAdventure.id)

      expect(adventureTodo.user_id).toBe(userId)
      expect(adventureTodo.display_name).toBe('Jimmy Clarkson')
    })

    test('can check completed on an adventure', async () => {
      const addCompletedResponse =
        await serviceHandler.userService.completeAdventure({
          userId,
          adventureId: newAdventure.id,
          isPublic: true
        })

      expect(addCompletedResponse.userCompleted).toBeDefined()
      expect(addCompletedResponse.adventureCompleted).toBeDefined()

      const { userCompleted, adventureCompleted } = addCompletedResponse
      expect(userCompleted.adventure_name).toBe(newAdventure.adventure_name)
      expect(userCompleted.adventure_id).toBe(newAdventure.id)

      expect(adventureCompleted.user_id).toBe(userId)
      expect(adventureCompleted.display_name).toBe('Jimmy Clarkson')

      const afterUser = await serviceHandler.userService.getUserFromId({
        userId
      })
      expect(afterUser.todo_adventures).toBeDefined()
      expect(afterUser.todo_adventures.length).toBe(0)
      expect(afterUser.completed_adventures).toBeDefined()
      expect(afterUser.completed_adventures.length).toBe(1)
    })

    test('can delete a user', async () => {
      await serviceHandler.userService.deleteUser({ userId })

      return serviceHandler.userService
        .getUserFromId({ userId })
        .catch((error) => {
          expect(error).toBe(`an account couldn't be found`)
        })
    })
  })
  describe('user sad paths', () => {
    test("trying to login with an email that doesn't exist gets handled properly", async () => {
      try {
        await serviceHandler.userService.loginWithEmailAndPassword({
          email: 'other@123.com',
          password: 'skiing'
        })
      } catch (error) {
        expect(error).toBe(
          'There was no user found with that email. Please try again or create a new user.'
        )
      }
    })
    test('trying to create a user with an email that aready exists gets handled properly', async () => {
      let response = await serviceHandler.userService.addNewUser({
        email: 'user@123.com',
        password: 'skiing',
        confirmPassword: 'skiing',
        firstName: 'Andrew',
        lastName: 'Maclean'
      })

      expect(response.user).toBeDefined()
      expect(response.token).toBeDefined()

      try {
        response = await serviceHandler.userService.addNewUser({
          email: 'user@123.com',
          password: 'snowboarding',
          confirmPassword: 'snowboarding',
          firstName: 'Travis',
          lastName: 'Rice'
        })
      } catch (error) {
        expect(error).toBe(
          'An account with this email aready exists. Please try a different email or login with that account.'
        )
      }
    })
  })
})
