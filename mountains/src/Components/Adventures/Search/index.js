import { useState } from 'react'
import { useDebounce, useGetAdventures } from '@amaclean2/sundaypeak-treewells'
import { useNavigate } from 'react-router'

import { FlexSpacer, FormField } from 'Components/Reusable'

import './styles.css'
import { LargeClimberIcon, LargeHikerIcon, LargeSkierIcon } from 'Images'

const AdventureSearch = () => {
	const { searchAdventures } = useGetAdventures()

	const [searchResults, setSearchResults] = useState(null)
	const [adventureText, setAdventureText] = useState('')
	const navigate = useNavigate()

	const handleSendSearchText = useDebounce((text) => {
		text.length && searchAdventures({ searchQuery: text }).then(setSearchResults)
	})

	const handleChange = (event) => {
		setAdventureText(event.target.value)
		handleSendSearchText(event.target.value)
	}

	return (
		<>
			<div className='adventure-search flex-box'>
				<FormField
					type='text'
					name={'adventure_search'}
					className={'adventure-search-field'}
					value={adventureText}
					isEditable
					testId={'adventure-search-field'}
					fullWidth
					autoComplete={'off'}
					placeholder={'Find an adventure'}
					onChange={handleChange}
				/>
				{searchResults ? (
					<ul className={'results-container'}>
						{searchResults.map((result, key) => (
							<li
								key={`search_result_${key}`}
								className={'drop-list-item flex-box'}
								onClick={() => navigate(`/adventure/${result.adventure_type}/${result.id}`)}
							>
								<span className='drop-list-image'>
									{result.adventure_type === 'ski' && <LargeSkierIcon size={20} />}
									{result.adventure_type === 'climb' && <LargeClimberIcon size={20} />}
									{result.adventure_type === 'hike' && <LargeHikerIcon size={20} />}
								</span>
								<span className='result-title'>{result.adventure_name}</span>
								<FlexSpacer />
								<span className='drop-list-secondary'>{result.nearest_city}</span>
							</li>
						))}
					</ul>
				) : (
					<div className={'adventure-search-spacer'} />
				)}
			</div>
		</>
	)
}

export default AdventureSearch
