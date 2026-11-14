import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Linkify from 'linkify-react'

import { Pin } from 'Images'
import { useGetAdventures, useGetZones, useZoneStateContext } from 'State'
import {
	Button,
	DisplayCard,
	Field,
	FieldHeader,
	FieldPage,
	FieldRow,
	FieldValue
} from 'Components/Reusable'
import StatTemplate from 'Components/UserProfile/StatTemplate'
import { NearbyZoneCards } from 'Components/Reusable/NearbyCard'
import { useAdventureMenu } from 'Components/Adventures/Buttons/utils'
import Breadcrumb from 'Components/Reusable/Breadcrumb'
import AdventureTitle from '../AdventureTitle'
import AdventureTypeTag from '../AdventureTypeTag'

import AdventureGallery from '../../Gallery'
import AdventuresInZone from './AdventuresInZone'
import ZonesInZone from './ZonesInZone'

const ZoneViewer = () => {
	const { currentZone, closeZones } = useZoneStateContext()
	const { getZone, getNearbyZones, clearCurrentZone } = useGetZones()
	const { clearCurrentAdventure } = useGetAdventures()
	const { zoneId } = useParams()
	const navigate = useNavigate()
	const { buildZoneMenu } = useAdventureMenu()

	const [childrenType, setChildrenType] = useState('adventures')

	useEffect(() => {
		if (!currentZone || currentZone.id !== zoneId) {
			getZone({ id: zoneId })
		}

		if (currentZone?.id) {
			getNearbyZones({
				type: currentZone.adventure_type,
				coordinates: currentZone.coordinates,
				excludeId: currentZone.id
			})
		}
	}, [zoneId, currentZone?.id])

	const renderAdventureTypeText = () => {
		switch (currentZone?.adventure_type) {
			case 'climb':
				return 'Climbing Area'
			case 'hike':
				return 'Hiking Area'
			case 'bike':
				return 'Biking Area'
			default:
				return 'Skiing Area'
		}
	}

	if (!currentZone) return null

	const hasZones = currentZone.zones?.length > 0
	const hasAdventures = currentZone.adventures?.length > 0
	const showChildrenToggle = hasZones && hasAdventures
	const visibleChildrenType = showChildrenToggle
		? childrenType
		: hasZones
		? 'zones'
		: 'adventures'

	let childrenText = null
	switch (currentZone.adventure_type) {
		case 'climb':
			childrenText = 'Climbs'
			break
		case 'hike':
			childrenText = 'Hikes'
			break
		case 'bike':
			childrenText = 'Rides'
			break
		default:
			childrenText = 'Lines'
			break
	}

	return (
		<DisplayCard
			onClose={() => {
				clearCurrentZone()
				clearCurrentAdventure()
				navigate('/discover')
			}}
			title={currentZone?.zone_name ?? 'New Zone'}
			menu={buildZoneMenu()}
		>
			<FieldPage className={'adventure-display-grid'}>
				<FieldRow className={'narrow-field'}>
					<Field noPadding>
						<Breadcrumb />
					</Field>
				</FieldRow>

				<AdventureTitle title={currentZone.zone_name ?? ''} />

				<FieldRow className={'location-row'}>
					<Field noPadding>
						<AdventureTypeTag
							type={currentZone.adventure_type ?? 'ski'}
							label={renderAdventureTypeText()}
						/>
					</Field>
					<Field className={'view-location'}>
						<Pin size={12} />
						{currentZone.nearest_city}
					</Field>
				</FieldRow>

				<FieldRow>
					<AdventureGallery spaceType={'zone'} />
				</FieldRow>

				<FieldRow>
					<Field longText>
						<Linkify options={{ defaultProtocol: 'https' }}>{currentZone.bio}</Linkify>
					</Field>
				</FieldRow>

				<FieldRow>
					<Field longText>
						<FieldHeader>Approach</FieldHeader>
						<Linkify options={{ defaultProtocol: 'https' }}>{currentZone.approach}</Linkify>
					</Field>
				</FieldRow>

				{showChildrenToggle && (
					<FieldRow className={'stats-container stats'}>
						<StatTemplate
							statLabel={'Areas'}
							statValue={currentZone.zones.length}
							selected={childrenType === 'zones'}
							onClick={() => setChildrenType('zones')}
						/>
						<StatTemplate
							statLabel={childrenText}
							statValue={currentZone.adventures.length}
							selected={childrenType === 'adventures'}
							onClick={() => setChildrenType('adventures')}
						/>
					</FieldRow>
				)}

				<FieldRow>
					{visibleChildrenType === 'zones' ? <ZonesInZone /> : <AdventuresInZone />}
				</FieldRow>

				<FieldRow className={'card-row'}>
					<Field cardField>
						<FieldHeader text={'Nearby Areas'} />
						<NearbyZoneCards zones={closeZones} />
					</Field>
				</FieldRow>

				{currentZone.creator && (
					<FieldRow>
						<Field>
							<FieldHeader text='Created By' />
							<FieldValue>
								<Button
									direction={`/user/${currentZone.creator.user_id}`}
									type='link'
								>
									{currentZone.creator.display_name}
								</Button>
							</FieldValue>
						</Field>
					</FieldRow>
				)}
			</FieldPage>
		</DisplayCard>
	)
}

export default ZoneViewer
