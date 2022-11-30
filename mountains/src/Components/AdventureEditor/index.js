import { useEffect, useRef } from 'react'

import { useAdventureStateContext, useGetAdventure } from '../../Providers'
import {
	DisplayCard,
	FieldHeader,
	FlexSpacer,
	HeaderSubtext,
	ProfileContent,
	ProfileHeader
} from '../Reusable'
import AdventureEditorButtons from './Buttons'
import AdventureEditorForm from './Editor'
import AdventureViewer from './Viewer'

import './styles.css'
import ConfirmationPage from '../Reusable/ConfirmationPage'
import AdventureEditorMenu from './Buttons/MenuFields'
import { useLocation, useNavigate } from 'react-router-dom'
import getContent from '../../TextContent'
import AdventureSearch from './Search'

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
	const { getAdventure } = useGetAdventure()
	const navigate = useNavigate()

	const menuRef = useRef()
	const loadedRef = useRef(false)

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
			adventureDispatch({
				type: 'editAdventure',
				payload: {
					editAdventureFields,
					currentAdventure: { ...currentAdventure, [e.target.name]: e.target.value }
				}
			})
		}
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
						latitude: adventure.coordinates.lat,
						longitude: adventure.coordinates.lng,
						zoom: 16,
						pitch: 0,
						bearing: 0
					}
				})
			})
		} else if (currentAdventure && !loadedRef.current) {
			if (typeof currentAdventure.coordinates === 'string') {
				return
			}

			loadedRef.current = true
			adventureDispatch({
				type: 'flyTo',
				payload: {
					latitude: currentAdventure.coordinates.lat,
					longitude: currentAdventure.coordinates.lng - 0.003,
					zoom: 16,
					pitch: 0,
					bearing: 0
				}
			})
		}
	}, [currentAdventure])

	const buildProfileHeader = () => {
		if (currentAdventure) {
			if (isAdventureEditable) {
				return (
					<ProfileHeader
						textContents={currentAdventure.adventure_name}
						editFields={{
							isEditable: isAdventureEditable,
							propName: 'adventure_name',
							onChange
						}}
					/>
				)
			} else {
				return (
					<ProfileHeader className={'user-profile-header'}>
						<div>
							<FieldHeader
								className='page-header'
								text={currentAdventure.adventure_name}
							/>
							{currentAdventure.nearest_city?.length && (
								<HeaderSubtext>{currentAdventure.nearest_city}</HeaderSubtext>
							)}
						</div>
						<FlexSpacer />
						<AdventureEditorMenu />
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
					{!isDeletePage && !currentAdventure && !adventureAddState && <AdventureSearch />}
				</div>
				<AdventureEditorButtons />
			</ProfileContent>
		</DisplayCard>
	)
}

export default AdventureEditor
