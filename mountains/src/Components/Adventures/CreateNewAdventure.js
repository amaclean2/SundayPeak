import { DisplayCard } from 'Components/Reusable'
import AdventureTypeSelector from './Editor/AdventureTypeSelector'

const CreateNewAdventure = () => {
	return (
		<DisplayCard title={'Create a New Adventure'}>
			<AdventureTypeSelector />
		</DisplayCard>
	)
}

export default CreateNewAdventure
