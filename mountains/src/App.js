import { Outlet } from 'react-router-dom'

import { ProvidersWrapper } from 'index'
import ReactMap from 'Components/Mapping/ReactMap'
import { ImageViewer } from 'Components/Reusable'
import Alert from 'Components/Reusable/Alert'

import './App.css'
import './variables.css'

export const title = 'Sunday Peak'

const App = () => {
	return (
		<ProvidersWrapper>
			<ReactMap />
			<Outlet />
			<ImageViewer />
			<Alert />
		</ProvidersWrapper>
	)
}

export default App
