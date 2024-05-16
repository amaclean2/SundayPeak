import { Outlet, useLocation } from 'react-router-dom'

import { ImageViewer } from 'Components/Reusable'
import Alert from 'Components/Reusable/Alert'
import AppRedirect from 'Components/AppRedirect'
import MapboxMap from 'Components/Mapping/MapboxMap'

import '../App.css'
import '../variables.css'

export const title = 'Sunday Peak'

const AppContent = () => {
	const screenWidth = window.screen.width
	const { pathname } = useLocation()

	const parsedPathname = pathname.split('/')[1]

	const blockingPaths = ['discover', 'user', 'adventure', 'conversations', '']

	if (screenWidth < 740) {
		localStorage.setItem('isMobile', true)
		if (blockingPaths.includes(parsedPathname)) {
			window.location.href = `sp:/${pathname}`
			return <AppRedirect />
		}
	} else {
		localStorage.setItem('isMobile', false)
	}

	return (
		<>
			<MapboxMap />
			<Outlet />
			<ImageViewer />
			<Alert />
		</>
	)
}

export default AppContent
