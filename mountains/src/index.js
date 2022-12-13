import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import reportWebVitals from './reportWebVitals'

import 'mapbox-gl/dist/mapbox-gl.css'
import { AdventureStateProvider, CardStateProvider, UserStateProvider } from 'Providers'
import { TokenStateProvider } from 'Providers/tokensProvider'

const ProvidersWrapper = () => (
	<TokenStateProvider>
		<CardStateProvider>
			<UserStateProvider>
				<AdventureStateProvider>
					<App />
				</AdventureStateProvider>
			</UserStateProvider>
		</CardStateProvider>
	</TokenStateProvider>
)

const root = ReactDOM.createRoot(document.getElementById('root'))

// root.render(
// 	<React.StrictMode>
// 		<ProvidersWrapper />
// 	</React.StrictMode>
// )

root.render(<ProvidersWrapper />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
