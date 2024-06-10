import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	useAdventureStateContext,
	useGetAdventures,
	useGetZones,
	useUserStateContext
} from '@amaclean2/sundaypeak-treewells'

import { Button, DisplayCard } from 'Components/Reusable'

import AdventureSearch from './Search'
import MainAdventureSelector from './Search/MainAdventureSelector'

import './styles.css'

const DefaultAdventureView = () => {
	const { loggedInUser } = useUserStateContext()
	const { getNearbyAdventures } = useGetAdventures()
	const { getNearbyZones } = useGetZones()
	const { globalAdventureType, startPosition } = useAdventureStateContext()
	const navigate = useNavigate()

	useEffect(() => {
		const adventureType = !['skiApproach', undefined].includes(globalAdventureType)
			? globalAdventureType
			: 'ski'
		getNearbyAdventures({
			type: adventureType,
			coordinates: { lat: startPosition?.lat ?? 2, lng: startPosition?.lng ?? 3 },
			count: 8
		})
		getNearbyZones({
			type: adventureType,
			coordinates: { lat: startPosition?.lat ?? 2, lng: startPosition?.lng ?? 3 },
			count: 5
		})
	}, [startPosition, globalAdventureType])

	return (
		<DisplayCard
			title={'Adventures'}
			id={'main-adventure-view'}
			onClose={() => navigate('/discover')}
		>
			<MainAdventureSelector />
			<AdventureSearch />
			{loggedInUser?.id && (
				<div className={'flex-box create-new-button'}>
					<Button
						secondaryButton
						id={'open-new-adventure-menu'}
						direction={'/adventure/new/adventure'}
					>
						Add a New Adventure
					</Button>
					<Button
						secondaryButton
						id={'open-new-adventure-menu'}
						direction={'/adventure/new/zone'}
					>
						Add a New Area
					</Button>
				</div>
			)}
		</DisplayCard>
	)
}

export default DefaultAdventureView
