import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	useAdventureStateContext,
	useDebounce,
	useGetAdventures,
	useGetZones,
	useSearch,
	useUserStateContext
} from 'State'

import { DisplayCard } from 'Components/Reusable'

import AdventureSearch from './Search'
import MainAdventureSelector from './Search/MainAdventureSelector'

import './styles.css'

const DefaultAdventureView = () => {
	const { loggedInUser } = useUserStateContext()
	const { getNearbyAdventures } = useGetAdventures()
	const { getNearbyZones } = useGetZones()
	const { globalAdventureType, startPosition } = useAdventureStateContext()
	const { searchAdventures, searchZones } = useSearch()
	const [searchText, setSearchText] = useState('')
	const [searchResults, setSearchResults] = useState(null)
	const navigate = useNavigate()

	const handleSendSearchText = useDebounce((text) => {
		text.length
			? Promise.all([
					searchAdventures({ searchText: text }),
					searchZones({ searchText: text })
				]).then(([adventures, zones]) => setSearchResults({ adventures, zones }))
			: setSearchResults(null)
	})

	const handleSearchChange = (text) => {
		setSearchText(text)
		handleSendSearchText(text)
	}

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
			className={'main-adventure-card'}
			onClose={() => navigate('/discover')}
			search={{
				value: searchText,
				onChange: handleSearchChange,
				placeholder: 'Find an adventure',
				testId: 'adventure-search-field'
			}}
		>
			<MainAdventureSelector />
			<AdventureSearch
				searchResults={searchResults}
				canCreate={!!loggedInUser?.id}
			/>
		</DisplayCard>
	)
}

export default DefaultAdventureView
