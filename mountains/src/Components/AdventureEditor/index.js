import { useEffect, useRef } from 'react'

import { useAdventureEditContext, useGetAdventure } from '../../Providers'
import { DisplayCard, FieldHeader, HeaderSubtext, ProfileContent, ProfileHeader } from '../Reusable'
import AdventureEditorButtons from './Buttons'
import AdventureEditorForm from './Editor'
import AdventureViewer from './Viewer'

import './styles.css'
import ConfirmationPage from '../Reusable/ConfirmationPage'
import AdventureEditorMenu from './Buttons/MenuFields'
import { useLocation, useNavigate } from 'react-router-dom'

const AdventureEditor = () => {
	const {
		setAdventureAddState,
		currentAdventure,
		setCurrentAdventure,
		setEditAdventureFields,
		adventureAddState,
		isEditable,
		setIsEditable,
		adventureError,
		setFlying,
		isDeletePage,
		setIsDeletePage
	} = useAdventureEditContext()
	const { pathname } = useLocation()
	const getAdventure = useGetAdventure()
	const navigate = useNavigate()

	const menuRef = useRef()

	const onChange = (e) => {
		if (currentAdventure.id) {
			setEditAdventureFields((currentFields) => ({
				...currentFields,
				[e.target.name]: e.target.value
			}))
		}

		setCurrentAdventure((workingAdventure) => ({
			...workingAdventure,
			[e.target.name]: e.target.value
		}))
	}

	const handleClose = () => {
		setCurrentAdventure(null)
		setAdventureAddState(false)
		setIsEditable(false)
		setIsDeletePage(false)
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
				setFlying({
					latitude: adventure.coordinates_lat,
					longitude: adventure.coordinates_lng,
					zoom: 16,
					pitch: 0,
					bearing: 0
				})
			})
		} else if (currentAdventure) {
			setFlying({
				latitude: currentAdventure.coordinates_lat,
				longitude: currentAdventure.coordinates_lng - 0.003,
				zoom: 16,
				pitch: 0,
				bearing: 0
			})
		}
	}, [])

	const buildProfileHeader = () => {
		if (currentAdventure) {
			if (isEditable) {
				return (
					<ProfileHeader
						textContents={currentAdventure.adventure_name}
						editFields={{
							isEditable,
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
						text='Adventure Creator'
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
							To add a new adventure, double click on any point on the map. Then fill in the details
							in the form provided.
						</ConfirmationPage>
					)}
					{isDeletePage && (
						<ConfirmationPage>
							Are you sure you want to delete this adventure?
							<br />
							It will be gone forever
						</ConfirmationPage>
					)}
					{!isDeletePage && currentAdventure && isEditable && (
						<AdventureEditorForm onChange={onChange} />
					)}
					{!isDeletePage && currentAdventure && !isEditable && <AdventureViewer />}
				</div>
				<AdventureEditorButtons />
			</ProfileContent>
		</DisplayCard>
	)
}

export default AdventureEditor
