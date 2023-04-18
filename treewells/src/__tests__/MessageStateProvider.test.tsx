import React from 'react'
import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import { mockFetch } from '../setupJest'
import { MessageTestApp } from '../__mocks__/TestApp'

describe('testing the message state provider', () => {
	beforeEach(() => {
		mockFetch.mockClear()
	})
	afterEach(cleanup)

	test('Can set current conversations', async () => {
		render(<MessageTestApp />)
		expect(screen.getByText(/Proof of conversations/i).textContent).toBe(
			'Proof of conversations: 0'
		)

		const setConversationsButton = screen.getByText(/Get All Coversations/i)
		fireEvent.click(setConversationsButton)

		expect(screen.getByText(/Proof of conversations/i).textContent).toBe(
			'Proof of conversations: 1'
		)
	})

	test('Can add a new conversation', async () => {
		render(<MessageTestApp />)

		const setConversationsButton = screen.getByText(/Get All Coversations/i)
		const addNewConversationButton = screen.getByText(/Add New Conversation/i)
		fireEvent.click(setConversationsButton)

		expect(screen.getByText(/Proof of conversations/i).textContent).toBe(
			'Proof of conversations: 1'
		)
		expect(screen.getByText(/Current conversation id/i).textContent).toBe(
			'Current conversation id: '
		)

		fireEvent.click(addNewConversationButton)

		expect(screen.getByText(/Proof of conversations/i).textContent).toBe(
			'Proof of conversations: 2'
		)
		expect(screen.getByText(/Current conversation id/i).textContent).toBe(
			'Current conversation id: 2'
		)
	})

	test('Can set the current conversation', async () => {
		render(<MessageTestApp />)

		const setConversationsButton = screen.getByText(/Get All Coversations/i)
		const addNewConversationButton = screen.getByText(/Add New Conversation/i)
		const currentConversationButton = screen.getByText(/Set Current Conversation/i)

		fireEvent.click(setConversationsButton)
		fireEvent.click(addNewConversationButton)

		expect(screen.getByText(/Proof of conversations/i).textContent).toBe(
			'Proof of conversations: 2'
		)
		expect(screen.getByText(/Current conversation id/i).textContent).toBe(
			'Current conversation id: 2'
		)

		fireEvent.click(currentConversationButton)

		expect(screen.getByText(/Current conversation id/i).textContent).toBe(
			'Current conversation id: 1'
		)
	})

	test('Can set messages', async () => {
		render(<MessageTestApp />)

		expect(screen.getByText(/Proof of messages/i).textContent).toBe('Proof of messages: ')

		const setMessagesButton = screen.getByText(/Set Messages/i)
		fireEvent.click(setMessagesButton)

		expect(screen.getByText(/Proof of messages/i).textContent).toBe('Proof of messages: 1')
	})

	test('Sending a message adds the message to the messages list', async () => {
		render(<MessageTestApp />)

		const setConversationsButton = screen.getByText(/Get All Coversations/i)
		const addNewConversationButton = screen.getByText(/Add New Conversation/i)
		const setMessagesButton = screen.getByText(/Set Messages/i)
		const sendMessageButton = screen.getByText(/Send Message/i)

		fireEvent.click(setConversationsButton)
		fireEvent.click(addNewConversationButton)
		fireEvent.click(setMessagesButton)

		expect(screen.getByText(/Proof of messages/i).textContent).toBe('Proof of messages: 1')

		fireEvent.click(sendMessageButton)

		expect(screen.getByText(/Proof of messages/i).textContent).toBe('Proof of messages: 2')
	})

	test('Sending a message adds the content to the last_message property of the conversation object', async () => {
		render(<MessageTestApp />)

		const setConversationsButton = screen.getByText(/Get All Coversations/i)
		const addNewConversationButton = screen.getByText(/Add New Conversation/i)
		const setMessagesButton = screen.getByText(/Set Messages/i)
		const sendMessageButton = screen.getByText(/Send Message/i)

		fireEvent.click(setConversationsButton)
		fireEvent.click(addNewConversationButton)
		fireEvent.click(setMessagesButton)

		expect(screen.getByText(/Proof of messages/i).textContent).toBe('Proof of messages: 1')
		expect(screen.getByText(/Last message/i).textContent).toBe('Last message: ')

		fireEvent.click(sendMessageButton)

		expect(screen.getByText(/Proof of messages/i).textContent).toBe('Proof of messages: 2')
		expect(screen.getByText(/Last message/i).textContent).toBe('Last message: Drinkin wine?')
	})

	test('Receiving a message adds the message to the messages list', async () => {
		render(<MessageTestApp />)

		const setConversationsButton = screen.getByText(/Get All Coversations/i)
		const addNewConversationButton = screen.getByText(/Add New Conversation/i)
		const setMessagesButton = screen.getByText(/Set Messages/i)
		const receiveMessageButton = screen.getByText(/Receive Message/i)

		fireEvent.click(setConversationsButton)
		fireEvent.click(addNewConversationButton)
		fireEvent.click(setMessagesButton)

		expect(screen.getByText(/Proof of messages/i).textContent).toBe('Proof of messages: 1')

		fireEvent.click(receiveMessageButton)

		expect(screen.getByText(/Proof of messages/i).textContent).toBe('Proof of messages: 2')
	})

	test('Receiving a message adds the content to the last_message property of the conversation object', async () => {
		render(<MessageTestApp />)

		const setConversationsButton = screen.getByText(/Get All Coversations/i)
		const addNewConversationButton = screen.getByText(/Add New Conversation/i)
		const setMessagesButton = screen.getByText(/Set Messages/i)
		const receiveMessageButton = screen.getByText(/Receive Message/i)

		fireEvent.click(setConversationsButton)
		fireEvent.click(addNewConversationButton)
		fireEvent.click(setMessagesButton)

		expect(screen.getByText(/Proof of messages/i).textContent).toBe('Proof of messages: 1')
		expect(screen.getByText(/Last message/i).textContent).toBe('Last message: ')

		fireEvent.click(receiveMessageButton)

		expect(screen.getByText(/Proof of messages/i).textContent).toBe('Proof of messages: 2')
		expect(screen.getByText(/Last message/i).textContent).toBe('Last message: Feelin fine')
	})

	test('Sending a message without a current conversation selected throws an error', async () => {
		render(<MessageTestApp />)

		const setConversationsButton = screen.getByText(/Get All Coversations/i)
		const sendMessageButton = screen.getByText(/Send Message/i)

		fireEvent.click(setConversationsButton)

		expect(screen.getByText(/Proof of messages/i).textContent).toBe('Proof of messages: ')
		expect(screen.queryByText(/Last message/i)).not.toBeInTheDocument()

		fireEvent.click(sendMessageButton)

		expect(screen.getByText(/Errors/i).textContent).toBe(
			'Errors: A current conversation needs to be selected before a message can be sent'
		)
	})
	test('Cannot set a current conversation that does not exist', async () => {
		render(<MessageTestApp />)

		expect(screen.getByText(/Proof of conversations/i).textContent).toBe(
			'Proof of conversations: 0'
		)

		const currentConversationButton = screen.getByText(/Set Current Conversation/i)

		fireEvent.click(currentConversationButton)

		expect(screen.getByText(/Errors/i).textContent).toBe(
			'Errors: Cannot set a current conversation without it existing in the conversations'
		)
	})
})
