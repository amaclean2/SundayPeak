import { useAdventureStateContext } from 'Providers'
import ClimbViewer from './ClimbViewer'
import HikeViewer from './HikeViewer'
import SkiViewer from './SkiViewer'

const AdventureEditorForm = () => {
	const { currentAdventure } = useAdventureStateContext()

	switch (currentAdventure.adventure_type) {
		case 'climb':
			return <ClimbViewer />
		case 'hike':
			return <HikeViewer />
		default:
			return <SkiViewer />
	}
}

export default AdventureEditorForm
