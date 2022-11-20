import { useEffect, useRef } from 'react'

import { useAdventureStateContext, useGetAdventure } from '../../Providers'
import { DisplayCard, FieldHeader, HeaderSubtext, ProfileContent, ProfileHeader } from '../Reusable'
import AdventureEditorButtons from './Buttons'
import AdventureEditorForm from './Editor'
import AdventureViewer from './Viewer'

import './styles.css'
import ConfirmationPage from '../Reusable/ConfirmationPage'
import AdventureEditorMenu from './Buttons/MenuFields'
import { useLocation, useNavigate } from 'react-router-dom'
import getContent from '../../TextContent'

const AdventureEditor = () => {
	const {
		adventureDispatch,
		editAdventureFields,
		currentAdventure,
		adventureAddState,
		isAdventureEditable,
		adventureError,
		isDeletePage
	} = useAdventureStateContext()
	const { pathname } = useLocation()
	const getAdventure = useGetAdventure()
	const navigate = useNavigate()

	const menuRef = useRef()

	const onChange = (e) => {
		if (currentAdventure.id) {
			adventureDispatch({
				type: 'editAdventure',
				payload: {
					editAdventureFields: { ...editAdventureFields, [e.target.name]: e.target.value },
					currentAdventure: { ...currentAdventure, [e.target.name]: e.target.value }
				}
			})
		} else {
		}
		adventureDispatch({
			type: 'editAdventure',
			payload: {
				editAdventureFields,
				currentAdventure: { ...currentAdventure, [e.target.name]: e.target.value }
			}
		})
	}

	const handleClose = () => {
		adventureDispatch({ type: 'closeAdventurePanel' })
		navigate('/discover')
	}

	// scrolls back to the top when there is a new error
	useEffect(() => {
		menuRef.current.scrollTop = 0
	}, [adventureError])

	useEffect(() => {
		const urlAdventureId = pathname?.includes('/adventure') && pathname.split('/')[2]

		if (urlAdventureId) {
			getAdventure({ id: urlAdventureId }).then(({ adventure }) => {
				adventureDispatch({
					type: 'flyTo',
					payload: {
						latitude: adventure.coordinates_lat,
						longitude: adventure.coordinates_lng,
						zoom: 16,
						pitch: 0,
						bearing: 0
					}
				})
			})
		} else if (currentAdventure) {
			adventureDispatch({
				type: 'flyTo',
				payload: {
					latitude: currentAdventure.coordinates_lat,
					longitude: currentAdventure.coordinates_lng - 0.003,
					zoom: 16,
					pitch: 0,
					bearing: 0
				}
			})
		}
	}, [])

	const buildProfileHeader = () => {
		if (currentAdventure) {
			if (isAdventureEditable) {
				return (
					<ProfileHeader
						textContents={currentAdventure.adventure_name}
						editFields={{
							isAdventureEditable,
							propName: 'adventure_name',
							onChange
						}}
					/>
				)
			} else {
				return (
					<ProfileHeader>
						<FieldHeader className='page-header'>
							{currentAdventure.adventure_name}
							<AdventureEditorMenu />
						</FieldHeader>
						<HeaderSubtext>{currentAdventure.nearest_city}</HeaderSubtext>
					</ProfileHeader>
				)
			}
		} else {
			return (
				<ProfileHeader>
					<FieldHeader
						className='page-header'
						text={getContent('adventurePanel.adventureCreator')}
					/>
				</ProfileHeader>
			)
		}
	}

	return (
		<DisplayCard onClose={handleClose}>
			{buildProfileHeader()}
			<ProfileContent ref={menuRef}>
				<div className='flex-box main-adventure-content'>
					{adventureAddState && (
						<ConfirmationPage>
							{getContent('adventurePanel.adventureCreatorContent')}
						</ConfirmationPage>
					)}
					{isDeletePage && (
						<ConfirmationPage>
							{getContent('adventurePanel.adventureDeleteContent')}
						</ConfirmationPage>
					)}
					{!isDeletePage && currentAdventure && isAdventureEditable && (
						<AdventureEditorForm onChange={onChange} />
					)}
					{!isDeletePage && currentAdventure && !isAdventureEditable && <AdventureViewer />}
				</div>
				<AdventureEditorButtons />
			</ProfileContent>
		</DisplayCard>
	)
}

export default AdventureEditor
