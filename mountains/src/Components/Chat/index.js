import { useEffect } from 'react'
import { useMessages } from '@amaclean2/sundaypeak-treewells'

import MessagingContianer from './MessagingContainer'

import './styles.css'

const Chat = () => {
	const { initiateConnection } = useMessages()

	useEffect(() => {
		initiateConnection()
	}, [])

	return <MessagingContianer />
}

export default Chat
