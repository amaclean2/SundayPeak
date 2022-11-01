import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Discover from './Discover'
import About from './About'
import '../App.css'
import '../variables.css'

export const title = 'Sunday Peak'

const AppRouter = () => {
	return (
		<Router>
			<div className='app-container'>
				<Routes>
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
