import { Outlet } from 'react-router-dom'
import { SundayPeakProviders } from '@amaclean2/sundaypeak-treewells'

import ReactMap from 'Components/Mapping/ReactMap'
import { ImageViewer } from 'Components/Reusable'
import Alert from 'Components/Reusable/Alert'
import AppRedirect from 'Components/AppRedirect'

import '../App.css'
import '../variables.css'

export const title = 'Sunday Peak'

const AppContent = () => {
	const screenWidth = window.screen.width

	if (screenWidth < 740) {
		return <AppRedirect />
	}

	return (
		<SundayPeakProviders>
			<ReactMap />
			<Outlet />
			<ImageViewer />
			<Alert />
		</SundayPeakProviders>
	)
}

export default AppContent
