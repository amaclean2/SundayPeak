import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAdventureMenu } from '../Buttons/utils'
import ClimbViewer from './ClimbViewer'
import HikeViewer from './HikeViewer'
import SkiViewer from './SkiViewer'
import { useAdventureStateContext } from 'Hooks/Providers'
import { useGetAdventure, useGetAdventures } from 'Hooks'

const AdventureViewer = () => {
	const { currentAdventure, adventureTypeViewer } = useAdventureStateContext()
	const { adventureId, adventureType } = useParams()
	const { getAdventure } = useGetAdventure()
	const { changeAdventureType } = useGetAdventures()
	const buildAdventureMenu = useAdventureMenu()

	useEffect(() => {
		if (!currentAdventure || currentAdventure.id !== adventureId) {
			// fetch the new adventure from the adventureId
			changeAdventureType({ type: adventureType })
			getAdventure({ id: adventureId, type: adventureType })
		} else if (currentAdventure.adventure_type !== adventureTypeViewer) {
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
