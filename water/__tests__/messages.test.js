const SundayService = require('..')
const {
  createStatements,
  deleteStatements
} = require('../DB/Statements/testStatements')

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

    for (const statement of createStatements) {
      await serviceHandler.sendQuery(statement)
    }

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
      for (const statement of deleteStatements) {
        await serviceHandler.sendQuery(statement)
      }
    })
  })

  test('creates a new conversation', async () => {
    let conversationName = 'Andrew and Mark'
    let newConversationResponse =
      await serviceHandler.messagingService.createConversation({
        userIds: [firstUser.id, secondUser.id],
        conversationName
      })

    expect(newConversationResponse.conversationName).toBeDefined()
    expect(newConversationResponse.conversationName).toBe(conversationName)
    firstConversationId = newConversationResponse.conversationId

    conversationName = 'Mark and Jessee'
    newConversationResponse =
      await serviceHandler.messagingService.createConversation({
        userIds: [secondUser.id, thirdUser.id],
        conversationName
      })

    expect(newConversationResponse.conversationName).toBeDefined()
    expect(newConversationResponse.conversationName).toBe(conversationName)

    conversationName = 'Andrew and Jessee'
    newConversationResponse =
      await serviceHandler.messagingService.createConversation({
        userIds: [firstUser.id, thirdUser.id],
        conversationName
      })

    expect(newConversationResponse.conversationName).toBeDefined()
    expect(newConversationResponse.conversationName).toBe(conversationName)

    conversationName = 'Andrew and Mark and Jessee'
    newConversationResponse =
      await serviceHandler.messagingService.createConversation({
        userIds: [firstUser.id, secondUser.id, thirdUser.id],
        conversationName
      })

    expect(newConversationResponse.conversationName).toBeDefined()
    expect(newConversationResponse.conversationName).toBe(conversationName)
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

    expect(messageSendResponse.body).toBeDefined()
    expect(messageSendResponse.body).toBe(messageText)
    expect(messageSendResponse.sender).toBe(firstUser.id)
    expect(messageSendResponse.conversation).toBe(firstConversationId)

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
})
