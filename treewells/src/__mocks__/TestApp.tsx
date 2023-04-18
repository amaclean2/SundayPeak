import React from 'react'

import { Connections } from '../config'

import { UserStateProvider } from '../Providers/UserStateProvider'
import { AdventureStateProvider } from '../Providers/AdventureStateProvider'
import { TokenStateProvider } from '../Providers/TokenStateProvider'
import { CardStateProvider } from '../Providers/CardStateProvider'
import { MessagingStateProvider } from '../Providers/MessageStateProvider'

import CardTestConsumer from './CardTestConsumer'
import MessageTestConsumer from './MessageTestConsumer'
import AdventureTestConsumer from './AdventureTestConsumer'
import TokenTestConsumer from './TokenTestConsumer'
import UserTestConsumer from './Users/UserTestConsumer'

Connections.setConnections(
	{ restUrl: 'http://api.sundaypeak.com', websocketUrl: 'ws://api.sundaypeak.com:4000' },
	localStorage
)

export const UserTestApp = (): JSX.Element => {
	return (
		<UserStateProvider>
			<UserTestConsumer />
		</UserStateProvider>
	)
}

export const AdventureTestApp = (): JSX.Element => {
	return (
		<AdventureStateProvider>
			<AdventureTestConsumer />
		</AdventureStateProvider>
	)
}

export const TokenTestApp = (): JSX.Element => {
	return (
		<TokenStateProvider>
			<TokenTestConsumer />
		</TokenStateProvider>
	)
}

export const CardTestApp = (): JSX.Element => {
	return (
		<CardStateProvider>
			<CardTestConsumer />
		</CardStateProvider>
	)
}

export const MessageTestApp = (): JSX.Element => {
	return (
		<MessagingStateProvider>
			<MessageTestConsumer />
		</MessagingStateProvider>
	)
}
