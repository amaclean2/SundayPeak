import { useEffect } from 'react'

import { useMessagingConnection } from 'Hooks'
import MessagingContianer from './MessagingContainer'
import './styles.css'

const Chat = () => {
	const { initiateConnection } = useMessagingConnection()

	useEffect(() => {
		initiateConnection()
	}, [])

	return <MessagingContianer />
}

export default Chat
