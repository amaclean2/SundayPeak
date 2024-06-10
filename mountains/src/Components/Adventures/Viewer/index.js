import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
	useAdventureStateContext,
	useGetAdventures,
	useSaveCompletedAdventure
} from '@amaclean2/sundaypeak-treewells'
import { useAdventureMenu } from '../Buttons/utils'
import ClimbViewer from './ClimbViewer'
import HikeViewer from './HikeViewer'
import SkiViewer from './SkiViewer'
import { Button, DisplayCard } from 'Components/Reusable'
import RatingSelector from 'Components/Reusable/RatingSelector'
import BikeViewer from './BikeViewer'
import SkiApproachViewer from './SkiApproachViewer'

const AdventureViewer = () => {
	const { currentAdventure, globalAdventureType } = useAdventureStateContext()
	const { adventureId, adventureType } = useParams()
	const { changeAdventureType, getAdventure } = useGetAdventures()
	const { getNearbyAdventures } = useGetAdventures()
	const { buildAdventureMenu } = useAdventureMenu()
	const { saveCompletedAdventure } = useSaveCompletedAdventure()

	const [isCompleteMenuOpen, setIsCompleteMenuOpen] = useState(false)
	const [rating, setRating] = useState(1)
	const [difficulty, setDifficulty] = useState(1)

	useEffect(() => {
		if (!currentAdventure || currentAdventure.id !== adventureId) {
			// fetch the new adventure from the adventureId
			changeAdventureType({ type: adventureType === 'skiApproach' ? 'ski' : adventureType })
			getAdventure({ id: adventureId, type: adventureType })
		} else if (currentAdventure?.adventure_type !== globalAdventureType) {
			changeAdventureType({
				type:
					currentAdventure.adventure_type === 'skiApproach'
						? 'ski'
						: currentAdventure.adventure_type
			})
		}

		if (currentAdventure?.id) {
			getNearbyAdventures({
				type: currentAdventure.adventure_type ?? globalAdventureType,
				coordinates: currentAdventure.coordinates
			})
		}
	}, [adventureId, currentAdventure?.id])

	useEffect(() => {
		if (typeof currentAdventure?.rating === 'number') {
			setRating(currentAdventure?.rating)
		} else if (currentAdventure?.rating.includes(':')) {
			setRating(Math.round(Number(currentAdventure?.rating.split(':')[0])))
		} else {
			setRating(Math.round(Number(currentAdventure?.rating)))
		}

		if (typeof currentAdventure?.difficulty === 'number') {
			setDifficulty(currentAdventure?.difficulty)
		} else if (currentAdventure?.difficulty.includes(':')) {
			setDifficulty(Math.round(Number(currentAdventure?.difficulty.split(':')[0])))
		} else {
			setDifficulty(Math.round(Number(currentAdventure?.difficulty)))
		}
	}, [currentAdventure?.rating, currentAdventure?.difficulty])

	if (!currentAdventure) {
		return null
	}

	const renderAdventureView = () => {
		switch (currentAdventure.adventure_type) {
			case 'climb':
				return <ClimbViewer menuContents={buildAdventureMenu(setIsCompleteMenuOpen)} />
			case 'hike':
				return <HikeViewer menuContents={buildAdventureMenu(setIsCompleteMenuOpen)} />
			case 'bike':
				return <BikeViewer menuContents={buildAdventureMenu(setIsCompleteMenuOpen)} />
			case 'skiApproach':
				return <SkiApproachViewer menuContents={buildAdventureMenu(setIsCompleteMenuOpen)} />
			default:
				return <SkiViewer menuContents={buildAdventureMenu(setIsCompleteMenuOpen)} />
		}
	}

	return (
		<div className='complete-adventure-box'>
			{renderAdventureView()}
			{isCompleteMenuOpen && (
				<DisplayCard
					configuration='center'
					hasClose={false}
					title={'Complete Adventure'}
				>
					<p>Vote on a rating and difficulty to complete this adventure.</p>
					<RatingSelector
						rating={rating}
						setRating={setRating}
					/>
					<RatingSelector
						rating={difficulty}
						title='Difficulty'
						setRating={setDifficulty}
						color='blue'
					/>
					<div className='flex-box button-container'>
						<Button
							onClick={() => {
								saveCompletedAdventure({
									adventureId: currentAdventure.id,
									adventureType: currentAdventure.adventure_type,
									rating: `${rating}:${currentAdventure.rating}`,
									difficulty: `${difficulty}:${currentAdventure.difficulty}`
								})
								setIsCompleteMenuOpen(false)
							}}
						>
							Complete
						</Button>
						<Button
							secondaryButton
							onClick={() => setIsCompleteMenuOpen(false)}
						>
							Cancel
						</Button>
					</div>
				</DisplayCard>
			)}
		</div>
	)
}

export default AdventureViewer
