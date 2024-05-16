import { useAdventureStateContext, useUserStateContext } from '@amaclean2/sundaypeak-treewells'
import React from 'react'

import getContent from 'TextContent'
import { Button, Field, FieldHeader, FieldPage, FieldRow, FieldValue } from 'Components/Reusable'
import RatingView from 'Components/Reusable/RatingView'
import { DistanceIcon, ElevationIcon, Pin } from 'Images'
import { formatSeasons } from 'Components/Adventures/utils'
import { DifficultyViewer } from '../Symbols'
import AdventureTickPanel from 'Components/Adventures/TickPanel'
import { ParentSize } from '@visx/responsive'
import ElevationChart from 'Components/Reusable/Chart'
import Linkify from 'linkify-react'
import NearbyCards from 'Components/Reusable/NearbyCard'

const Fields = () => {
	const { currentAdventure, closeAdventures } = useAdventureStateContext()
	const { loggedInUser } = useUserStateContext()

	return (
		<FieldPage className={'adventure-display-grid'}>
			<FieldRow className={'narrow-field'}>
				<Field noPadding>
					<RatingView ratingCount={Number(currentAdventure?.rating.split(':')[0])} />
				</Field>
			</FieldRow>

			<FieldRow className={'location-row'}>
				<Field className={'view-location'}>
					<Pin size={20} />
					{currentAdventure.nearest_city}
				</Field>
			</FieldRow>
			<FieldRow className='adventure-bio'>
				<Field
					longText
					noPadding
				>
					<Linkify options={{ defaultProtocol: 'https' }}>{currentAdventure.bio}</Linkify>
				</Field>
			</FieldRow>

			<FieldRow borderBottom>
				<Field borderRight>
					<FieldHeader text={'Distance'} />
					<FieldValue className={'flex-box'}>
						<DistanceIcon />
						{getContent('adventurePanel.fields.approachContent', [
							currentAdventure.elevations?.[currentAdventure.elevations.length - 1]?.[1].toFixed(2)
						])}
					</FieldValue>
				</Field>
				<Field>
					<FieldHeader text={getContent('adventurePanel.fields.elevation')} />
					<FieldValue className='flex-box'>
						<ElevationIcon />
						{getContent('adventurePanel.fields.elevationContent', [
							currentAdventure.base_elevation,
							currentAdventure.summit_elevation
						])}
					</FieldValue>
				</Field>
			</FieldRow>

			<FieldRow borderBottom>
				<Field borderRight>
					<FieldHeader text={getContent('adventurePanel.fields.difficulty')} />
					<FieldValue>
						<DifficultyViewer difficulty={currentAdventure.difficulty} />
					</FieldValue>
				</Field>
				<Field borderRight>
					<FieldHeader text={'Climb'} />
					<FieldValue className='flex-box'>{currentAdventure.climb?.toString()} ft</FieldValue>
				</Field>
				<Field>
					<FieldHeader text={'Descent'} />
					<FieldValue className='flex-box'>
						{Math.abs(currentAdventure.descent?.toString())} ft
					</FieldValue>
				</Field>
			</FieldRow>

			<FieldRow borderBottom>
				<Field>
					<FieldHeader text={getContent('adventurePanel.fields.bestSeason')} />
					<FieldValue>
						{currentAdventure.season?.length
							? formatSeasons({
									seasonArray: currentAdventure.season.length
										? JSON.parse(currentAdventure.season)
										: []
							  })
							: ''}
					</FieldValue>
				</Field>
			</FieldRow>

			<FieldRow>
				<Field>
					<FieldHeader text='Created By' />
					<FieldValue>
						<Button
							direction={`/user/${currentAdventure.creator_id}`}
							type='link'
						>
							{currentAdventure.creator_name}
						</Button>
					</FieldValue>
				</Field>
			</FieldRow>

			<FieldRow>
				<Field noPadding>
					<FieldHeader
						text={'Elevation Chart'}
						largeHeader
					/>
					{currentAdventure?.elevations?.length ? (
						<ParentSize>
							{({ width }) => (
								<ElevationChart
									width={width}
									height={200}
									data={currentAdventure.elevations}
								/>
							)}
						</ParentSize>
					) : null}
				</Field>
			</FieldRow>

			<FieldRow>
				<Field noPadding>
					<FieldHeader
						text={'Nearby'}
						largeHeader
					/>
					<NearbyCards adventures={closeAdventures} />
				</Field>
			</FieldRow>

			{loggedInUser && <AdventureTickPanel />}
		</FieldPage>
	)
}

export default Fields
