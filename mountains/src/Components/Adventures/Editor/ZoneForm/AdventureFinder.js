import React, { useEffect, useState } from 'react'
import {
	Button,
	DisplayCard,
	Field,
	FieldHeader,
	FieldPage,
	FieldRow,
	FlexSpacer,
	FooterButtons,
	FormField
} from 'Components/Reusable'
import {
	useAdventureStateContext,
	useDebounce,
	useGetAdventures,
	useSaveAdventure,
	useSaveZones,
	useSearch,
	useZoneStateContext
} from '@amaclean2/sundaypeak-treewells'
import { LargeActivityIcon } from 'Images'
import { useNavigate, useParams } from 'react-router-dom'
import DeletePage from '../DeletePage'

const AdventureChildFinder = () => {
	const { currentZone } = useZoneStateContext()
	const { isDeletePageOpen, closeAdventures } = useAdventureStateContext()

	const { addAdventureToZone } = useSaveZones()
	const { getNearbyAdventures } = useGetAdventures()
	const { toggleZoneAdd } = useSaveAdventure()
	const { searchAdventures } = useSearch()
	const navigate = useNavigate()
	const { zoneId } = useParams()

	const [searchValue, setSearchValue] = useState('')
	const [searchResults, setSearchResults] = useState(null)

	const handleSendSearchText = useDebounce((text) => {
		if (text.length)
			return searchAdventures({ searchText: text, parentZoneId: currentZone.id }).then(
				setSearchResults
			)

		return setSearchResults(null)
	})

	const handleChange = (event) => {
		setSearchValue(event.target.value)
		handleSendSearchText(event.target.value)
	}

	useEffect(() => {
		if (!currentZone) {
			navigate(`/zone/${zoneId}`)
			return
		}

		getNearbyAdventures({
			type: currentZone.adventure_type,
			coordinates: currentZone.coordinates,
			count: 10,
			zoneId: currentZone.id
		})
	}, [currentZone])

	return (
		<DisplayCard
			title={currentZone?.zone_name ?? 'New Area'}
			className={'zone-edit'}
			onClose={() => navigate(-1)}
		>
			<div className='flex-box flex-edit-fields'>
				<FieldPage>
					<FieldRow>
						<Field noPadding>
							<FieldHeader
								largeHeader
								text={'Add an Adventure'}
							/>
						</Field>
					</FieldRow>

					<FieldRow>
						<Field
							noPadding
							className={'tick-list-contianer flex-box'}
						>
							<FormField
								name='zone_child_search'
								label={'Search'}
								isEditable
								fullWidth
								hideLabel
								value={searchValue}
								autoFocus={true}
								onChange={handleChange}
							/>
							{searchValue ? (
								<ul className='tick-list flex-box results-container child-search'>
									{searchResults?.map((result, key) => (
										<li
											key={`search_result_${key}`}
											className={'drop-list-item flex-box'}
											onClick={() => {
												addAdventureToZone({
													parentId: currentZone.id,
													adventureId: result.adventure_id
												})
												navigate(-1)
											}}
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
							) : (
								<ul className='tick-list flex-box results-container child-search'>
									{closeAdventures?.map((result, key) => (
										<li
											key={`search_result_${key}`}
											className={'drop-list-item flex-box'}
											onClick={() => {
												addAdventureToZone({
													parentId: currentZone.id,
													adventureId: result.adventure_id
												})
												navigate(-1)
											}}
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
							)}
						</Field>
					</FieldRow>
				</FieldPage>
				<FlexSpacer />
			</div>
			<FooterButtons row>
				<Button
					onClick={() => {
						toggleZoneAdd(currentZone?.id)
						navigate('/adventure/new/adventure')
					}}
				>
					Create New Adventure
				</Button>
				<Button
					onClick={() => navigate(-1)}
					secondaryButton
				>
					Back
				</Button>
			</FooterButtons>
			{isDeletePageOpen && <DeletePage />}
		</DisplayCard>
	)
}

export default AdventureChildFinder
