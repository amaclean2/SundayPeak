import { useState } from 'react'
import { useDebounce, useGetAdventures } from '@amaclean2/sundaypeak-treewells'

import { Button, FlexSpacer, FormField } from 'Components/Reusable'

import './styles.css'

const AdventureSearch = () => {
	const { searchAdventures } = useGetAdventures()

	const [searchResults, setSearchResults] = useState(null)
	const [adventureText, setAdventureText] = useState('')

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
								className={'drop-list-item'}
							>
								<Button
									direction={`/adventure/${result.adventure_type}/${result.id}`}
									className={'adventure-result'}
								>
									<span className='result-title'>{result.adventure_name}</span>
									<span className='drop-list-subtext'>{result.adventure_type}</span>
									<FlexSpacer />
									<span className='drop-list-secondary'>{result.nearest_city}</span>
								</Button>
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
