import { useEffect, useRef } from 'react'

import { useAdventureEditContext } from '../../Providers'
import { DisplayCard, FieldHeader, HeaderSubtext, ProfileHeader } from '../Reusable'
import AdventureEditorButtons from './Buttons'
import AdventureEditorForm from './Form'
import AdventureViewer from './Viewer'

import './styles.css'

const AdventureEditor = () => {
	const {
		setAdventureAddState,
		currentAdventure,
		setCurrentAdventure,
		isEditable,
		setIsEditable,
		adventureError,
		setFlying
	} = useAdventureEditContext()

	const menuRef = useRef()

	const onChange = (e) => {
		return setCurrentAdventure((workingAdventure) => {
			const newAdventure = { ...workingAdventure }
			newAdventure[e.target.name] = e.target.value

			return newAdventure
		})
	}

	const handleClose = () => {
		setCurrentAdventure(null)
		setAdventureAddState(false)
		setIsEditable(false)
	}

	// scrolls back to the top when there is a new error
	useEffect(() => {
		menuRef.current.scrollTop = 0
	}, [adventureError])

	useEffect(() => {
		setFlying({
			latitude: currentAdventure.coordinates_lat - 0.001,
			longitude: currentAdventure.coordinates_lng - 0.004,
			zoom: 16,
			pitch: 60
		})
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
						<FieldHeader
							className='page-header'
							text={currentAdventure.adventure_name}
						/>
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
					{currentAdventure && isEditable && <AdventureEditorForm onChange={onChange} />}
					{currentAdventure && !isEditable && <AdventureViewer />}
				</div>
				<AdventureEditorButtons />
			</div>
		</DisplayCard>
	)
}

export default AdventureEditor
