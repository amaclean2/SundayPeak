import { LargeClimberIcon, LargeHikerIcon, LargeSkierIcon } from 'Images'
import React, { useEffect, useState } from 'react'
import {
	CARD_TYPES,
	useAdventureStateContext,
	useCardStateContext,
	useGetAdventure,
	useGetAdventures
} from '../../../Providers'
import { Button, FlexSpacer, FormField } from '../../Reusable'

import './styles.css'

const AdventureSearch = () => {
	const [adventureText, setAdventureText] = useState('')
	const [searchResults, setSearchResults] = useState(null)

	const { searchAdventures, refetchAdventures } = useGetAdventures()
	const { getAdventure } = useGetAdventure()
	const { cardDispatch } = useCardStateContext()
	const { adventureDispatch } = useAdventureStateContext()

	useEffect(() => {
		searchAdventures({ searchQuery: adventureText }).then((adventures) =>
			setSearchResults(adventures)
		)
	}, [adventureText])

	const openAdventure = (id, type) => {
		return getAdventure({ id }).then(() => {
			cardDispatch({ type: 'switchCard', payload: CARD_TYPES.adventures })
			adventureDispatch({ type: 'adventureTypeViewer', payload: type })
		})
	}

	const changeAdventureType = (newType) => {
		adventureDispatch({ type: 'adventureTypeViewer', payload: newType })
		refetchAdventures({})
	}

	return (
		<>
			<div className='adventure-search flex-box'>
				<FormField
					type='text'
					name={'adventure_search'}
					value={adventureText}
					isEditable
					fullWidth
					autoComplete={'off'}
					placeholder={'Find an adventure'}
					onChange={(e) => setAdventureText(e.target.value)}
				/>
				{searchResults && (
					<ul className={'results-container'}>
						{searchResults.map((result, key) => (
							<li
								key={`search_result_${key}`}
								className={'search-list-item flex-box'}
								onClick={() => openAdventure(result.id, result.adventure_type)}
							>
								{result.adventure_name}
								<span className='search-list-subtext'>{result.adventure_type}</span>
								<FlexSpacer />
								{result.nearest_city}
							</li>
						))}
					</ul>
				)}
			</div>
			<div className='adventure-type-selector'>
				<h3>Adventure Types</h3>
				<Button
					id='set-ski-adventure-type'
					className={'change-adventure-type'}
					onClick={() => changeAdventureType('ski')}
				>
					<LargeSkierIcon size={30} />
					Ski
				</Button>
				<Button
					id='set-climb-adventure-type'
					className={'change-adventure-type'}
					onClick={() => changeAdventureType('climb')}
				>
					<LargeClimberIcon size={30} />
					Climb
				</Button>
				<Button
					id='set-hike-adventure-type'
					className={'change-adventure-type'}
					onClick={() => changeAdventureType('hike')}
				>
					<LargeHikerIcon size={30} />
					Hike
				</Button>
			</div>
		</>
	)
}

export default AdventureSearch
