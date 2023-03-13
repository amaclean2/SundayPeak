import {
	// BrowserRouter as Router,
	// Routes,
	Route,
	createBrowserRouter,
	createRoutesFromElements,
	Outlet
} from 'react-router-dom'

// import Discover from './Discover'
// import About from './About'
// import PrivacyPolicy from 'PrivacyPolicy'
import ButtonBar from 'Components/ButtonBar'
import { LoginFlow, NewPassword, PasswordResetCapture, SignupFlow } from 'Components/SignupFlow'
import App from 'App'
import UserViewer from 'Components/UserProfile/Viewer'
import UserEditor from 'Components/UserProfile/Editor'
import Chat from 'Components/Chat'
import DefaultAdventureView from 'Components/Adventures'
import CreateNewAdventure from 'Components/Adventures/CreateNewAdventure'
import AdventureEditorForm from 'Components/Adventures/Editor'
import AdventureViewer from 'Components/Adventures/Viewer'

export const title = 'Sunday Peak'

// remmeber to add the path in Router/Discover.js

export const router = createBrowserRouter(
	createRoutesFromElements(
		<Route
			path={'/'}
			element={<App />}
		>
			<Route
				index
				element={<ButtonBar />}
			/>
			<Route
				path={'login'}
				element={<LoginFlow />}
			/>
			<Route
				path={'password-reset'}
				element={<PasswordResetCapture />}
			/>
			<Route
				path={'password'}
				element={<NewPassword />}
			/>
			<Route
				path={'signup'}
				element={<SignupFlow />}
			/>
			<Route
				path={'discover'}
				element={<ButtonBar />}
			/>
			<Route
				path={'user'}
				element={<Outlet />}
			>
				<Route
					index
					element={<UserViewer />}
				/>
				<Route
					path={'edit'}
					element={<UserEditor />}
				/>
				<Route
					path={':userId'}
					element={<UserViewer />}
				/>
			</Route>
			<Route
				path={'adventure'}
				element={<Outlet />}
			>
				<Route
					index
					element={<DefaultAdventureView />}
				/>
				<Route
					path={'new'}
					element={<CreateNewAdventure />}
				/>
				<Route
					path={'edit/:adventureType/:adventureId'}
					element={<AdventureEditorForm />}
				/>
				<Route
					path={':adventureType/:adventureId'}
					element={<AdventureViewer />}
				/>
			</Route>
			<Route
				path={'conversations'}
				element={<Chat />}
			/>
		</Route>
	)
)

/** const AppRouter = () => {
	return (
		<Router>
			<div className='app-container'>
				<Routes>
					<Route
						path='/adventure/:adventureId'
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

export default AppRouter */
