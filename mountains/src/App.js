import { RouterProvider } from 'react-router-dom'
import { Connections } from '@amaclean2/sundaypeak-treewells'

const { router } = require('Router')

Connections.setConnections(
	{
		restUrl: process.env.REACT_APP_API_URL,
		websocketUrl: process.env.REACT_APP_WEBSOCKET_URL
	},
	localStorage
)

const App = () => <RouterProvider router={router} />

export default App
