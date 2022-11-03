import { useMemo } from 'react'
import { Marker } from 'react-map-gl'
import { SkierIcon } from '../../Images'
import { useAdventureEditContext } from '../../Providers'
import { useCreateNewAdventure } from './utils'

const AdventurePins = ({ setPopupInfo, boundingBox }) => {
	const { allAdventures } = useAdventureEditContext()
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
						setPopupInfo,
						boundingBox
					})
				}}
			>
				<SkierIcon size={20} />
			</Marker>
		))
	}, [allAdventures])

	return <>{pins}</>
}

export default AdventurePins
