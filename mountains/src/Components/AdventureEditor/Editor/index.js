import { useAdventureStateContext } from 'Providers'
import { useEffect } from 'react'
import ClimbForm from './ClimbForm'
import HikeForm from './HikeForm'
import SkiForm from './SkiForm'

const AdventureEditorForm = ({ onChange }) => {
	const { currentAdventure, adventureTypeViewer } = useAdventureStateContext()

	useEffect(() => {
		if (!currentAdventure?.adventure_type) {
			onChange({ target: { name: 'adventure_type', value: adventureTypeViewer } })
		}
	}, [])

	switch (adventureTypeViewer || currentAdventure.adventure_type) {
		case 'climb':
			return <ClimbForm onChange={onChange} />
		case 'hike':
			return <HikeForm onChange={onChange} />
		default:
			return <SkiForm onChange={onChange} />
	}
}

export default AdventureEditorForm
