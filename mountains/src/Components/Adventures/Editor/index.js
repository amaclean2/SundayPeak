import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import ClimbForm from './ClimbForm'
import HikeForm from './HikeForm'
import SkiForm from './SkiForm'
import { useAdventureStateContext } from 'Hooks/Providers'
import { useGetAdventure, useSaveAdventure } from 'Hooks'

const AdventureEditorForm = () => {
	const { currentAdventure } = useAdventureStateContext()
	const { getAdventure } = useGetAdventure()
	const { editAdventure } = useSaveAdventure()
	const { adventureId, adventureType } = useParams()

	useEffect(() => {
		if (!currentAdventure) {
			// fetch the new adventure from the adventureId
			getAdventure({ id: adventureId, type: adventureType })
		}
	}, [])

	if (!currentAdventure) {
		return null
	}

	switch (currentAdventure.adventure_type) {
		case 'climb':
			return <ClimbForm onChange={editAdventure} />
		case 'hike':
			return <HikeForm onChange={editAdventure} />
		default:
			return <SkiForm onChange={editAdventure} />
	}
}

export default AdventureEditorForm
