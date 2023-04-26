import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
	useAdventureStateContext,
	useGetAdventures,
	useSaveAdventure
} from '@amaclean2/sundaypeak-treewells'

import ClimbForm from './ClimbForm'
import HikeForm from './HikeForm'
import SkiForm from './SkiForm'

const AdventureEditorForm = () => {
	const { currentAdventure } = useAdventureStateContext()
	const { getAdventure } = useGetAdventures()
	const { editAdventure } = useSaveAdventure()
	const { adventureId, adventureType } = useParams()

	useEffect(() => {
		if (!currentAdventure) {
			// fetch the new adventure from the adventureId
			try {
				getAdventure({ id: adventureId, type: adventureType })
			} catch (error) {
				console.log({ error })
			}
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
