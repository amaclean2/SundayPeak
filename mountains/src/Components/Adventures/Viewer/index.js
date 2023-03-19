import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAdventureStateContext, useGetAdventures } from 'sundaypeak-treewells'
import { useAdventureMenu } from '../Buttons/utils'
import ClimbViewer from './ClimbViewer'
import HikeViewer from './HikeViewer'
import SkiViewer from './SkiViewer'

const AdventureViewer = () => {
	const { currentAdventure, globalAdventureType } = useAdventureStateContext()
	const { adventureId, adventureType } = useParams()
	const { changeAdventureType, getAdventure } = useGetAdventures()
	const buildAdventureMenu = useAdventureMenu()

	useEffect(() => {
		if (!currentAdventure || currentAdventure.id !== adventureId) {
			// fetch the new adventure from the adventureId
			changeAdventureType({ type: adventureType })
			getAdventure({ id: adventureId, type: adventureType })
		} else if (currentAdventure.adventure_type !== globalAdventureType) {
			changeAdventureType({ type: currentAdventure.adventure_type })
		}
	}, [adventureId])

	if (!currentAdventure) {
		return null
	}

	switch (currentAdventure.adventure_type) {
		case 'climb':
			return <ClimbViewer menuContents={buildAdventureMenu()} />
		case 'hike':
			return <HikeViewer menuContents={buildAdventureMenu()} />
		default:
			return <SkiViewer menuContents={buildAdventureMenu()} />
	}
}

export default AdventureViewer
