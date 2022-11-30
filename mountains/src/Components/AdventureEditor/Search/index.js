import React, { useEffect, useState } from 'react'
import {
	CARD_TYPES,
	useCardStateContext,
	useGetAdventure,
	useGetAdventures
} from '../../../Providers'
import { FlexSpacer, FormField } from '../../Reusable'

import './styles.css'

const AdventureSearch = () => {
	const [adventureText, setAdventureText] = useState('')
	const [searchResults, setSearchResults] = useState(null)

	const { searchAdventures } = useGetAdventures()
	const { getAdventure } = useGetAdventure()
	const { cardDispatch } = useCardStateContext()

	useEffect(() => {
		searchAdventures({ searchQuery: adventureText }).then((adventures) =>
			setSearchResults(adventures)
		)
	}, [adventureText])

	const openAdventure = (id) => {
		return getAdventure({ id }).then(() => {
			cardDispatch({ type: 'switchCard', payload: CARD_TYPES.adventures })
		})
	}

	return (
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
							className={'flex-box'}
							onClick={() => openAdventure(result.id)}
						>
							{result.adventure_name}
							<FlexSpacer />
							{result.nearest_city}
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default AdventureSearch
