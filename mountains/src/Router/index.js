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
import UserViewer from 'Components/UserProfile/Viewer'
import UserEditor from 'Components/UserProfile/Editor'
import DefaultAdventureView from 'Components/Adventures'
import AdventureEditorForm from 'Components/Adventures/Editor'
import AdventureViewer from 'Components/Adventures/Viewer'
import AppContent from 'Router/AppContent'
import MetaPageContent from 'MetaPages'
import HomePage from 'MetaPages/FirstPage'
import PrivacyPolicy from 'MetaPages/Privacy'
import SupportPage from 'MetaPages/Support'
import MessagingContianer from 'Components/Chat/MessagingContainer'
import AdventureTypeSelector from 'Components/Adventures/Editor/AdventureTypeSelector'
import ZoneForm from 'Components/Adventures/Editor/ZoneForm'
import ZoneViewer from 'Components/Adventures/Viewer/ZoneViewer'
import AdventureChildFinder from 'Components/Adventures/Editor/ZoneForm/AdventureFinder'
import ZoneChildFinder from 'Components/Adventures/Editor/ZoneForm/ZoneFinder'

export const title = 'Sunday Peak'

// remmeber to add the path in Router/Discover.js

export const router = createBrowserRouter(
	createRoutesFromElements(
		<Route
			path={'/'}
			element={<Outlet />}
		>
			<Route
				path={'about'}
				element={
					<MetaPageContent>
						<HomePage />
					</MetaPageContent>
				}
			/>
			<Route
				path={'privacy'}
				element={
					<MetaPageContent>
						<PrivacyPolicy />
					</MetaPageContent>
				}
			/>
			<Route
				path={'support'}
				element={
					<MetaPageContent>
						<SupportPage />
					</MetaPageContent>
				}
			/>
			<Route
				path={'*'}
				element={<AppContent />}
			>
				<Route
					index
					element={<DefaultAdventureView />}
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
						path={'new/:type'}
						element={<AdventureTypeSelector />}
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
					path={'zone'}
					elemet={<Outlet />}
				>
					<Route
						path={':zoneId'}
						element={<ZoneViewer />}
					/>
					<Route
						path={'edit/:zoneId'}
						element={<ZoneForm />}
					/>
					<Route
						path={'edit/:zoneId/adventureFinder'}
						element={<AdventureChildFinder />}
					/>
					<Route
						path={'edit/:zoneId/zoneFinder'}
						element={<ZoneChildFinder />}
					/>
				</Route>
				<Route
					path={'conversations'}
					element={<MessagingContianer />}
				/>
			</Route>
		</Route>
	)
)
