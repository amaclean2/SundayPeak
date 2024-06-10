import { useState } from 'react'
import {
	useAdventureStateContext,
	useDebounce,
	useSearch,
	useZoneStateContext
} from '@amaclean2/sundaypeak-treewells'
import { useNavigate } from 'react-router'

import { Field, FieldHeader, FieldPage, FieldRow, FlexSpacer, FormField } from 'Components/Reusable'

import './styles.css'
import { LargeActivityIcon } from 'Images'

const AdventureSearch = () => {
	const { searchAdventures, searchZones } = useSearch()
	const { closeAdventures } = useAdventureStateContext()
	const { closeZones } = useZoneStateContext()
	const [searchResults, setSearchResults] = useState(null)
	const [adventureText, setAdventureText] = useState('')
	const navigate = useNavigate()

	const handleSendSearchText = useDebounce((text) => {
		text.length
			? searchAdventures({ searchText: text }).then((adventureResults) => {
					searchZones({ searchText: text }).then((zoneResults) => {
						console.log({ adventures: adventureResults, zones: zoneResults })
						setSearchResults({
							adventures: adventureResults,
							zones: zoneResults
						})
					})
			  })
			: setSearchResults(null)
	})

	const handleChange = (event) => {
		setAdventureText(event.target.value)
		handleSendSearchText(event.target.value)
	}

	return (
		<FieldPage className='adventure-search flex-box'>
			<FormField
				type='text'
				name={'adventure_search'}
				className={'adventure-search-field'}
				value={adventureText}
				isEditable
				testId={'adventure-search-field'}
				fullWidth
				placeholder={'Find an adventure'}
				onChange={handleChange}
			/>
			{searchResults?.adventures.length || searchResults?.zones.length ? (
				<>
					<FieldRow>
						<Field noPadding>
							<FieldHeader
								text={'Areas'}
								leftHeader
							/>
							<ul className={'results-container'}>
								{searchResults?.zones?.map((result, key) => (
									<li
										key={`search_result_${key}`}
										className={'drop-list-item flex-box'}
										onClick={() => navigate(`/zone/${result.zone_id}`)}
									>
										<span className='drop-list-image'>
											<LargeActivityIcon
												type={result.adventure_type}
												size={20}
											/>
										</span>
										<span className='result-title'>{result.zone_name}</span>
										<FlexSpacer />
										<span className='drop-list-secondary'>{result.nearest_city}</span>
									</li>
								))}
							</ul>
						</Field>
					</FieldRow>
					<FieldRow>
						<Field noPadding>
							<FieldHeader
								text={'Adventures'}
								leftHeader
							/>
							<ul className={'results-container'}>
								{searchResults?.adventures?.map((result, key) => (
									<li
										key={`search_result_${key}`}
										className={'drop-list-item flex-box'}
										onClick={() =>
											navigate(`/adventure/${result.adventure_type}/${result.adventure_id}`)
										}
									>
										<span className='drop-list-image'>
											<LargeActivityIcon
												type={result.adventure_type}
												size={20}
											/>
										</span>
										<span className='result-title'>{result.adventure_name}</span>
										<FlexSpacer />
										<span className='drop-list-secondary'>{result.nearest_city}</span>
									</li>
								))}
							</ul>
						</Field>
					</FieldRow>
				</>
			) : (
				<>
					<FieldRow>
						<Field noPadding>
							<FieldHeader
								text={'Areas'}
								leftHeader
							/>
							<ul className={'results-container'}>
								{closeZones?.map((result, key) => (
									<li
										key={`zone_${key}`}
										className={'drop-list-item flex-box default-list-item'}
										onClick={() => navigate(`/zone/${result.zone_id}`)}
									>
										<span className='drop-list-image'>
											<LargeActivityIcon
												type={result.adventure_type}
												size={20}
											/>
										</span>
										<span className='result-title'>{result.zone_name}</span>
										<FlexSpacer />
										<span className='drop-list-secondary'>{result.nearest_city}</span>
									</li>
								))}
							</ul>
						</Field>
					</FieldRow>
					<FieldRow>
						<Field noPadding>
							<FieldHeader
								text={'Adventures'}
								leftHeader
							/>
							<ul className={'results-container'}>
								{closeAdventures?.map((result, key) => (
									<li
										key={`adventure_${key}`}
										className={'drop-list-item flex-box default-list-item'}
										onClick={() => navigate(`/adventure/${result.adventure_type}/${result.id}`)}
									>
										<span className='drop-list-image'>
											<LargeActivityIcon
												type={result.adventure_type}
												size={20}
											/>
										</span>
										<span className='result-title'>{result.adventure_name}</span>
										<FlexSpacer />
										<span className='drop-list-secondary'>{result.nearest_city}</span>
									</li>
								))}
							</ul>
						</Field>
					</FieldRow>
				</>
			)}
		</FieldPage>
	)
}

export default AdventureSearch
