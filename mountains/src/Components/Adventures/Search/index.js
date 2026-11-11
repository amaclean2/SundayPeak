import PropTypes from 'prop-types'
import { useAdventureStateContext, useZoneStateContext } from 'State'
import { useNavigate } from 'react-router'

import { Field, FieldHeader, FieldPage, FieldRow, FlexSpacer } from 'Components/Reusable'

import './styles.css'
import { LargeActivityIcon } from 'Images'

const AdventureSearch = ({ searchResults }) => {
	const { closeAdventures } = useAdventureStateContext()
	const { closeZones } = useZoneStateContext()
	const navigate = useNavigate()

	return (
		<FieldPage className='adventure-search flex-box'>
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
			)}
		</FieldPage>
	)
}

AdventureSearch.propTypes = {
	searchResults: PropTypes.shape({
		adventures: PropTypes.array,
		zones: PropTypes.array
	})
}

export default AdventureSearch
