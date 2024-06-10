import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Linkify from 'linkify-react'

import { Pin } from 'Images'
import { useGetAdventures, useGetZones, useZoneStateContext } from '@amaclean2/sundaypeak-treewells'
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
			getNearbyZones({ type: currentZone.adventure_type, coordinates: currentZone.coordinates })
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
				<FieldRow className={'zone-type-field narrow-field'}>
					<Field>
						<FieldHeader>{renderAdventureTypeText()}</FieldHeader>
					</Field>
				</FieldRow>

				<FieldRow className={'narrow-field'}>
					<Field noPadding>
						<Breadcrumb />
					</Field>
				</FieldRow>

				<FieldRow className={'location-row'}>
					<Field className={'view-location'}>
						<Pin size={20} />
						{currentZone.nearest_city}
					</Field>
				</FieldRow>

				<FieldRow>
					<AdventureGallery spaceType={'zone'} />
				</FieldRow>

				<FieldRow>
					<Field
						longText
						noPadding
					>
						<Linkify options={{ defaultProtocol: 'https' }}>{currentZone.bio}</Linkify>
					</Field>
				</FieldRow>

				<FieldRow>
					<Field
						longText
						noPadding
					>
						<FieldHeader>Approach</FieldHeader>
						<Linkify options={{ defaultProtocol: 'https' }}>{currentZone.approach}</Linkify>
					</Field>
				</FieldRow>

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

				<FieldRow>{childrenType === 'zones' ? <ZonesInZone /> : <AdventuresInZone />}</FieldRow>

				<FieldRow>
					<Field cardField>
						<FieldHeader text={'Nearby Areas'} />
						<NearbyZoneCards zones={closeZones} />
					</Field>
				</FieldRow>

				<FieldRow>
					<Field noPadding>
						<FieldHeader text='Created By' />
						<FieldValue>
							<Button
								direction={`/user/${currentZone.creator_id}`}
								type='link'
							>
								{currentZone.creator_name}
							</Button>
						</FieldValue>
					</Field>
				</FieldRow>
			</FieldPage>
		</DisplayCard>
	)
}

export default ZoneViewer
