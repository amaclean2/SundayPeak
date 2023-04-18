import { RouterProvider } from 'react-router-dom'
import { Connections } from 'sundaypeak-treewells'

const { router } = require('Router')

let restUrl, websocketUrl

switch (process.env.NODE_ENV) {
	case 'production':
		restUrl = 'http://api.sundaypeak.com'
		websocketUrl = 'ws://api.sundaypeak.com:4000'
		break
	default:
		restUrl = 'http://sundaypeak.local:5000'
		websocketUrl = 'ws://sundaypeak.local:4000'
}

Connections.setConnections({ restUrl, websocketUrl }, localStorage)

const App = () => <RouterProvider router={router} />

export default App
