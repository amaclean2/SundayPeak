import { useEffect, useRef } from 'react'

import { useAdventureEditContext } from '../../Providers'
import { Button, DisplayCard, FieldHeader, HeaderSubtext, ProfileHeader } from '../Reusable'
import AdventureEditorButtons from './Buttons'
import AdventureEditorForm from './Form'
import AdventureViewer from './Viewer'

import './styles.css'
import ConfirmationPage from '../Reusable/ConfirmationPage'
import { Meatball } from '../../Images/Meatball'
import Menu from '../Reusable/Menu'
import AdventureEditorMenu from './Buttons/MenuFields'

const AdventureEditor = () => {
	const {
		setAdventureAddState,
		currentAdventure,
		setCurrentAdventure,
		setEditAdventureFields,
		isEditable,
		setIsEditable,
		adventureError,
		setFlying,
		isDelete,
		setIsDelete
	} = useAdventureEditContext()

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
		setIsDelete(false)
	}

	// scrolls back to the top when there is a new error
	useEffect(() => {
		menuRef.current.scrollTop = 0
	}, [adventureError])

	useEffect(() => {
		if (currentAdventure) {
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
			<div
				className='profile-content'
				ref={menuRef}
			>
				<div className='flex-box main-adventure-content'>
					{isDelete && (
						<ConfirmationPage type='delete'>
							Are you sure you want to delete this adventure?
							<br />
							It will be gone forever
						</ConfirmationPage>
					)}
					{!isDelete && currentAdventure && isEditable && (
						<AdventureEditorForm onChange={onChange} />
					)}
					{!isDelete && currentAdventure && !isEditable && <AdventureViewer />}
				</div>
				<AdventureEditorButtons />
			</div>
		</DisplayCard>
	)
}

export default AdventureEditor
