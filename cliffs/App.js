import AdventureView from './AdventureView'
import { AppStateProvider } from './Hooks/Providers/appStateProvider'
import MapView from './MapView'

const App = () => {
	return (
		<AppStateProvider>
			<AdventureView />
		</AppStateProvider>
	)
}

export default App
