import { Outlet } from 'react-router-dom'
import { SundayPeakProviders } from 'sundaypeak-treewells'

import ReactMap from 'Components/Mapping/ReactMap'
import { ImageViewer } from 'Components/Reusable'
import Alert from 'Components/Reusable/Alert'

import '../App.css'
import '../variables.css'

export const title = 'Sunday Peak'

const AppContent = () => {
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
