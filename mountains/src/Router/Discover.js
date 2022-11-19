import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import ButtonBar from '../Components/ButtonBar'
import ReactMap from '../Components/Mapping/ReactMap'
import { ImageViewer } from '../Components/Reusable'
import Alert from '../Components/Reusable/Alert'
import { CARD_TYPES, useCardStateContext } from '../Providers'

const Discover = () => {
	const { pathname } = useLocation()
	const { cardDispatch } = useCardStateContext()

	useEffect(() => {
		if (pathname.includes('/password')) {
			cardDispatch({ type: 'openCard', payload: CARD_TYPES.new_password })
		} else if (pathname.includes('/login')) {
			cardDispatch({ type: 'openCard', payload: CARD_TYPES.login })
		} else if (pathname.includes('/adventure')) {
			cardDispatch({ type: 'openCard', payload: CARD_TYPES.adventures })
		} else if (pathname.includes('/user')) {
			cardDispatch({ type: 'openCard', payload: CARD_TYPES.profile })
		} else if (pathname.includes('/signup')) {
			cardDispatch({ type: 'openCard', payload: CARD_TYPES.signup })
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
