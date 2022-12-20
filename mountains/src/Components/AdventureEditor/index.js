import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useAdventureStateContext, useGetAdventure } from 'Providers'
import { ConfirmationPage, DisplayCard, ProfileContent } from 'Components/Reusable'
import getContent from 'TextContent'

import AdventureEditorButtons from './Buttons'
import AdventureEditorForm from './Editor'
import AdventureViewer from './Viewer'
import AdventureSearch from './Search'

import './styles.css'
import AdventureTypeSelector from './Editor/AdventureTypeSelector'
import AdventureHeader from './AdventureHeader'

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

	const [addAdventureInstructions, setAddAdventureInstructions] = useState(false)

	const menuRef = useRef()
	const loadedRef = useRef(false)

	const onChange = (e) => {
		if (currentAdventure.id && currentAdventure.id !== 'waiting') {
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
		setAddAdventureInstructions(false)
		navigate('/discover')
	}

	// scrolls back to the top when there is a new error
	useEffect(() => {
		menuRef.current.scrollTop = 0
	}, [adventureError])

	useEffect(() => {
		const urlAdventureId = pathname?.includes('/adventure') && pathname.split('/')[2]

		// if a new adventure comes from the url
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

	return (
		<DisplayCard onClose={handleClose}>
			<AdventureHeader onChange={onChange} />
			<ProfileContent ref={menuRef}>
				<div className='flex-box main-adventure-content'>
					{adventureAddState && (
						<>
							{addAdventureInstructions ? (
								<ConfirmationPage>
									{getContent('adventurePanel.adventureCreatorContent')}
								</ConfirmationPage>
							) : (
								<AdventureTypeSelector setAddAdventureInstructions={setAddAdventureInstructions} />
							)}
						</>
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
