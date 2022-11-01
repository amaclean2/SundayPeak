import { useMemo } from 'react'
import { Marker } from 'react-map-gl'
import { SkierIcon } from '../../Images'
import { useAdventureEditContext } from '../../Providers'

const AdventurePins = ({ setPopupInfo }) => {
	const { allAdventures } = useAdventureEditContext()

	const pins = useMemo(() => {
		return allAdventures?.map((adventure, idx) => (
			<Marker
				key={`marker_${idx}`}
				longitude={adventure.coordinates.lng}
				latitude={adventure.coordinates.lat}
				anchor={'bottom'}
				onClick={(e) => {
					e.originalEvent.stopPropagation()
					setPopupInfo(adventure)
				}}
			>
				<SkierIcon size={20} />
			</Marker>
		))
	}, [allAdventures])

	return <>{pins}</>
}

export default AdventurePins
