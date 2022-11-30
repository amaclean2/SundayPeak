import { ClimberIcon } from 'Images/ClimberIcon'
import { HikerIcon } from 'Images/HikerIcon'
import { useMemo } from 'react'
import { Marker } from 'react-map-gl'
import { SkierIcon } from '../../Images'
import { useAdventureStateContext } from '../../Providers'
import { useCreateNewAdventure } from './utils'

const AdventurePins = ({ boundingBox }) => {
	const { allAdventures, adventureTypeViewer } = useAdventureStateContext()
	const { viewMore } = useCreateNewAdventure()

	const pins = useMemo(() => {
		return allAdventures?.map((adventure, idx) => (
			<Marker
				key={`marker_${idx}`}
				longitude={adventure.coordinates.lng}
				latitude={adventure.coordinates.lat}
				anchor={'bottom'}
				onClick={(e) => {
					e.originalEvent.stopPropagation()
					// setPopupInfo(adventure)
					viewMore({
						id: adventure.id,
						boundingBox
					})
				}}
			>
				{adventureTypeViewer === 'ski' && (
					<SkierIcon
						size={25}
						className={'pin-marker'}
					/>
				)}
				{adventureTypeViewer === 'climb' && (
					<ClimberIcon
						size={25}
						className={'pin-marker'}
					/>
				)}
				{adventureTypeViewer === 'hike' && (
					<HikerIcon
						size={25}
						className={'pin-marker'}
					/>
				)}
			</Marker>
		))
	}, [allAdventures])

	return <>{pins}</>
}

export default AdventurePins
