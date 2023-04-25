import { useUserStateContext } from '@amaclean2/sundaypeak-treewells'

import { Button, DisplayCard } from 'Components/Reusable'

import AdventureSearch from './Search'
import MainAdventureSelector from './Search/MainAdventureSelector'

import './styles.css'

const DefaultAdventureView = () => {
	const { loggedInUser } = useUserStateContext()
	return (
		<DisplayCard
			title={'Adventures'}
			testId={'main-adventure-view'}
		>
			<MainAdventureSelector />
			<AdventureSearch />
			{loggedInUser?.id && (
				<Button
					secondaryButton
					id={'open-new-adventure-menu'}
					direction={'/adventure/new'}
				>
					Add a New Adventure
				</Button>
			)}
		</DisplayCard>
	)
}

export default DefaultAdventureView
