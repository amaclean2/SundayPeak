import cx from 'classnames'

import { LargeClimberIcon, LargeHikerIcon, LargeSkierIcon } from 'Images'
import { useState } from 'react'
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
	const { searchAdventures, changeAdventureType } = useGetAdventures()
	const { getAdventure } = useGetAdventure()
	const { cardDispatch } = useCardStateContext()
	const { adventureDispatch, adventureTypeViewer } = useAdventureStateContext()

	const [searchResults, setSearchResults] = useState(null)
	const [adventureText, setAdventureText] = useState('')

	const openAdventure = (id, type) => {
		return getAdventure({ id }).then(() => {
			cardDispatch({ type: 'switchCard', payload: CARD_TYPES.adventures })
			adventureDispatch({ type: 'adventureTypeViewer', payload: type })
		})
	}

	const handleEnter = () => {
		if (adventureText.length) {
			searchAdventures({ searchQuery: adventureText }).then(setSearchResults)
		}
	}

	console.log({ adventureTypeViewer })

	return (
		<>
			<div className='adventure-search flex-box'>
				<FormField
					type='text'
					name={'adventure_search'}
					className={'adventure-search-field'}
					value={adventureText}
					isEditable
					fullWidth
					options={{
						onEnter: handleEnter
					}}
					autoComplete={'off'}
					placeholder={'Find an adventure'}
					onChange={(e) => setAdventureText(e.target.value)}
				/>
				{searchResults && (
					<ul className={'results-container'}>
						{searchResults.map((result, key) => (
							<li
								key={`search_result_${key}`}
								className={'drop-list-item flex-box'}
								onClick={() => openAdventure(result.id, result.adventure_type)}
							>
								<span className='result-title'>{result.adventure_name}</span>
								<span className='drop-list-subtext'>{result.adventure_type}</span>
								<FlexSpacer />
								<span className='drop-list-secondary'>{result.nearest_city}</span>
							</li>
						))}
					</ul>
				)}
			</div>
			<div className='adventure-type-selector'>
				<h3>Adventure Types</h3>
				<Button
					id='set-ski-adventure-type'
					className={cx(
						'change-adventure-type',
						adventureTypeViewer === 'ski' && 'current-adventure-type'
					)}
					onClick={() => changeAdventureType('ski')}
				>
					<LargeSkierIcon
						size={30}
						color={adventureTypeViewer === 'ski' ? '#FFF' : '#000'}
					/>
					Ski
				</Button>
				<Button
					id='set-climb-adventure-type'
					className={cx(
						'change-adventure-type',
						adventureTypeViewer === 'climb' && 'current-adventure-type'
					)}
					onClick={() => changeAdventureType('climb')}
				>
					<LargeClimberIcon
						size={30}
						color={adventureTypeViewer === 'climb' ? '#FFF' : '#000'}
					/>
					Climb
				</Button>
				<Button
					id='set-hike-adventure-type'
					className={cx(
						'change-adventure-type',
						adventureTypeViewer === 'hike' && 'current-adventure-type'
					)}
					onClick={() => changeAdventureType('hike')}
				>
					<LargeHikerIcon
						size={30}
						color={adventureTypeViewer === 'hike' ? '#FFF' : '#000'}
					/>
					Hike
				</Button>
			</div>
		</>
	)
}

export default AdventureSearch
