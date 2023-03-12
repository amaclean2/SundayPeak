const SundayService = require('..')

let serviceHandler, firstUser, secondUser, thirdUser, firstConversationId

describe('message service layer testing', () => {
  beforeAll(async () => {
    serviceHandler = new SundayService(
      {
        host: 'localhost',
        user: 'byf',
        password: 'backyard',
        database: 'test_messages',
        port: '3306'
      },
      'secret'
    )

    await serviceHandler.createTables()

    let newUser = await serviceHandler.userService.addNewUser({
      email: 'andrew@email.com',
      password: 'skiing',
      confirmPassword: 'skiing',
      firstName: 'Andrew',
      lastName: 'Maclean'
    })
    firstUser = newUser.user

    newUser = await serviceHandler.userService.addNewUser({
      email: 'mark@email.com',
      password: 'cycling',
      confirmPassword: 'cycling',
      firstName: 'Mark',
      lastName: 'Cavendish'
    })
    secondUser = newUser.user

    newUser = await serviceHandler.userService.addNewUser({
      email: 'jessee@email.com',
      password: 'running',
      confirmPassword: 'running',
      firstName: 'Jessee',
      lastName: 'Thomas'
    })
    thirdUser = newUser.user
  })
  afterAll(async () => {
    // adding data to searchable users and searchable adventures happens asynchronously
    // not waiting to delete the tables was deleting the tables before the query could finish
    setTimeout(async () => {
      await serviceHandler.removeTables()
    })
  })

  test('creates a new conversation', async () => {
    let newConversationResponse =
      await serviceHandler.messagingService.createConversation({
        userIds: [firstUser.id, secondUser.id]
      })

    expect(newConversationResponse.conversationId).toBeDefined()
    firstConversationId = newConversationResponse.conversationId

    newConversationResponse =
      await serviceHandler.messagingService.createConversation({
        userIds: [secondUser.id, thirdUser.id]
      })

    expect(newConversationResponse.conversationId).toBeDefined()

    newConversationResponse =
      await serviceHandler.messagingService.createConversation({
        userIds: [firstUser.id, thirdUser.id]
      })

    expect(newConversationResponse.conversationId).toBeDefined()

    newConversationResponse =
      await serviceHandler.messagingService.createConversation({
        userIds: [firstUser.id, secondUser.id, thirdUser.id]
      })

    expect(newConversationResponse.conversationId).toBeDefined()
  })

  test('gets all the conversations relevant to a user', async () => {
    const userId = firstUser.id
    const conversationResponse =
      await serviceHandler.messagingService.getConversationsPerUser({ userId })

    expect(Object.keys(conversationResponse).length).toBe(3)
    Object.values(conversationResponse).forEach((value) => {
      expect(
        value.users.find((user) => user.user_id === firstUser.id)
      ).toBeTruthy()
      expect(
        value.users.find((user) => user.user_id !== firstUser.id)
      ).toBeTruthy()
      expect(value.last_message).toBeDefined()
      expect(value.unread).toBe(false)
    })
  })

  test('sends a message', async () => {
    const messageText = 'Hi, this is my first message!'
    const messageSendResponse =
      await serviceHandler.messagingService.sendMessage({
        conversationId: firstConversationId,
        senderId: firstUser.id,
        messageBody: messageText
      })

    expect(messageSendResponse.message_body).toBeDefined()
    expect(messageSendResponse.message_body).toBe(messageText)
    expect(messageSendResponse.user_id).toBe(firstUser.id)
    expect(messageSendResponse.conversation_id).toBe(firstConversationId)

    await serviceHandler.messagingService.sendMessage({
      conversationId: firstConversationId,
      senderId: secondUser.id,
      messageBody: 'Hi Andrew!'
    })
  })

  test('after a message is sent, the other participants get unread set to true', async () => {
    const userId = secondUser.id
    const conversationResponse =
      await serviceHandler.messagingService.getConversationsPerUser({ userId })

    expect(conversationResponse[firstConversationId].unread).toBe(true)

    for (const id in conversationResponse) {
      if (Number(id) !== firstConversationId) {
        expect(conversationResponse[id].unread).toBe(false)
      }
    }
  })

  test('the last_message property of the conversation should be the last message sent', async () => {
    const userId = secondUser.id
    const conversationResponse =
      await serviceHandler.messagingService.getConversationsPerUser({ userId })

    expect(conversationResponse[firstConversationId].last_message).toBe(
      'Hi Andrew!'
    )
  })

  test('gets all the messages for a conversation', async () => {
    const userId = secondUser.id
    const conversationId = firstConversationId
    const messagesResponse =
      await serviceHandler.messagingService.getConversation({
        conversationId,
        userId
      })

    expect(messagesResponse.length).toBe(2)
  })
  test('creating a new conversation returns the id of the already made conversation if one exists between those users', async () => {
    let newConversationResponse =
      await serviceHandler.messagingService.createConversation({
        userIds: [firstUser.id, secondUser.id]
      })

    expect(newConversationResponse.conversation_exists).toBe(true)
    expect(newConversationResponse.conversation).toBeDefined()
    expect(newConversationResponse.conversation.conversation_id).toBe(1)
    expect(newConversationResponse.conversation.last_message).toBeDefined()
  })
})
