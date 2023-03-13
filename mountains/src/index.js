import { RouterProvider } from 'react-router-dom'
import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom/client'

import { router } from 'Router'
import reportWebVitals from './reportWebVitals'
import {
	AdventureStateProvider,
	CardStateProvider,
	MessagingStateProvider,
	TokenStateProvider,
	UserStateProvider
} from 'Hooks/Providers'

import 'mapbox-gl/dist/mapbox-gl.css'

export const ProvidersWrapper = ({ children }) => (
	<TokenStateProvider>
		<CardStateProvider>
			<UserStateProvider>
				<AdventureStateProvider>
					<MessagingStateProvider>{children}</MessagingStateProvider>
				</AdventureStateProvider>
			</UserStateProvider>
		</CardStateProvider>
	</TokenStateProvider>
)

ProvidersWrapper.propTypes = {
	children: PropTypes.node
}

const root = ReactDOM.createRoot(document.getElementById('root'))

// root.render(
// 	<React.StrictMode>
// 		<ProvidersWrapper />
// 	</React.StrictMode>
// )

root.render(<RouterProvider router={router} />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
