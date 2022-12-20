import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Discover from './Discover'
import About from './About'
import '../App.css'
import '../variables.css'
import PrivacyPolicy from 'PrivacyPolicy'

export const title = 'Sunday Peak'

// remmeber to add the path in Router/Discover.js

const AppRouter = () => {
	return (
		<Router>
			<div className='app-container'>
				<Routes>
					<Route
						path='/adventure/:adventureId'
						element={<Discover />}
					/>
					<Route
						path='/adventure'
						element={<Discover />}
					/>
					<Route
						path='/privacy'
						element={<PrivacyPolicy />}
					/>
					<Route
						path='/password'
						element={<Discover />}
					/>
					<Route
						path='/plan'
						element={<Discover />}
					/>
					<Route
						path='/login'
						element={<Discover />}
					/>
					<Route
						path='/signup'
						element={<Discover />}
					/>
					<Route
						path='/discover'
						element={<Discover />}
					/>
					<Route
						path='/about'
						element={<About />}
					/>
					<Route
						path='/'
						element={<Discover />}
					/>
				</Routes>
			</div>
		</Router>
	)
}

export default AppRouter
