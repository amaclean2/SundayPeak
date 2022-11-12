import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import ButtonBar from '../Components/ButtonBar'
import ReactMap from '../Components/Mapping/ReactMap'
import { ImageViewer } from '../Components/Reusable'
import Alert from '../Components/Reusable/Alert'
import { CARD_TYPES, useCardStateContext } from '../Providers'

const Discover = () => {
	const { pathname } = useLocation()
	const { openCard } = useCardStateContext()

	useEffect(() => {
		if (pathname.includes('/password')) {
			openCard(CARD_TYPES.new_password)
		} else if (pathname.includes('/login')) {
			openCard(CARD_TYPES.login)
		} else if (pathname.includes('/adventure')) {
			openCard(CARD_TYPES.adventures)
		} else if (pathname.includes('/user')) {
			openCard(CARD_TYPES.profile)
		} else if (pathname.includes('/signup')) {
			openCard(CARD_TYPES.signup)
		}
	}, [])

	return (
		<>
			<ReactMap />
			<ButtonBar />
			<ImageViewer />
			<Alert />
		</>
	)
}

export default Discover
