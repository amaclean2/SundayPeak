import PropTypes from 'prop-types'
import { useAdventureStateContext, useZoneStateContext } from 'State'
import { useNavigate } from 'react-router'

import { Button, Field, FieldHeader, FieldPage, FieldRow, FlexSpacer } from 'Components/Reusable'

import './styles.css'
import { LargeActivityIcon } from 'Images'

const SectionHeader = ({ text, button }) => (
	<div className={'section-header flex-box'}>
		<FieldHeader
			text={text}
			leftHeader
		/>
		{button && (
			<Button
				secondaryButton
				small
				id={button.id}
				direction={button.direction}
			>
				{button.label}
			</Button>
		)}
	</div>
)

SectionHeader.propTypes = {
	text: PropTypes.string,
	button: PropTypes.shape({
		id: PropTypes.string,
		direction: PropTypes.string,
		label: PropTypes.string
	})
}

const AdventureSearch = ({ searchResults, canCreate }) => {
	const { closeAdventures } = useAdventureStateContext()
	const { closeZones } = useZoneStateContext()
	const navigate = useNavigate()

	const newZoneButton = canCreate && {
		id: 'open-new-zone-menu',
		direction: '/adventure/new/zone',
		label: 'Add a New Area'
	}
	const newAdventureButton = canCreate && {
		id: 'open-new-adventure-menu',
		direction: '/adventure/new/adventure',
		label: 'Add a New Adventure'
	}

	return (
		<FieldPage className='adventure-search flex-box'>
			{searchResults?.adventures.length || searchResults?.zones.length ? (
				<>
					<FieldRow>
						<Field noPadding>
							<SectionHeader
								text={'Areas'}
								button={newZoneButton}
							/>
							<ul className={'area-pill-list flex-box'}>
								{searchResults?.zones?.map((result, key) => (
									<li
										key={`search_result_${key}`}
										className={'area-pill'}
										title={result.nearest_city}
										onClick={() => navigate(`/zone/${result.zone_id}`)}
									>
										{result.zone_name}
									</li>
								))}
							</ul>
						</Field>
					</FieldRow>
					<FieldRow>
						<Field noPadding>
							<SectionHeader
								text={'Adventures'}
								button={newAdventureButton}
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
							<SectionHeader
								text={'Areas'}
								button={newZoneButton}
							/>
							<ul className={'area-pill-list flex-box'}>
								{closeZones?.map((result, key) => (
									<li
										key={`zone_${key}`}
										className={'area-pill'}
										title={result.nearest_city}
										onClick={() => navigate(`/zone/${result.zone_id}`)}
									>
										{result.zone_name}
									</li>
								))}
							</ul>
						</Field>
					</FieldRow>
					<FieldRow>
						<Field noPadding>
							<SectionHeader
								text={'Adventures'}
								button={newAdventureButton}
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
										<div className={'results-data-container flex-box'}>
											<span className='result-title'>{result.adventure_name}</span>
											<span className='drop-list-secondary'>{result.nearest_city}</span>
										</div>
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
	}),
	canCreate: PropTypes.bool
}

export default AdventureSearch
