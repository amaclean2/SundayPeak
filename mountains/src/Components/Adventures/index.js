import {
	useAdventureStateContext,
	useGetAdventures,
	useUserStateContext
} from '@amaclean2/sundaypeak-treewells'

import { Button, DisplayCard } from 'Components/Reusable'

import AdventureSearch from './Search'
import MainAdventureSelector from './Search/MainAdventureSelector'

import './styles.css'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const DefaultAdventureView = () => {
	const { loggedInUser } = useUserStateContext()
	const { getAdventureList } = useGetAdventures()
	const { globalAdventureType, startPosition } = useAdventureStateContext()
	const navigate = useNavigate()

	useEffect(() => {
		getAdventureList({
			type: globalAdventureType ?? 'ski',
			coordinates: { lat: startPosition?.latitude ?? 2, lng: startPosition?.longitude ?? 3 }
		})
	}, [startPosition, globalAdventureType])

	return (
		<DisplayCard
			title={'Adventures'}
			testId={'main-adventure-view'}
			onClose={() => navigate('/discover')}
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
