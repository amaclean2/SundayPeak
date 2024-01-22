import { useAdventureStateContext, useUserStateContext } from '@amaclean2/sundaypeak-treewells'
import React from 'react'

import getContent from 'TextContent'
import { Button, Field, FieldHeader, FieldPage, FieldRow, FieldValue } from 'Components/Reusable'
import RatingView from 'Components/Reusable/RatingView'
import { DistanceIcon, ElevationIcon, Pin } from 'Images'
import { formatSeasons, pitchClimbs } from 'Components/Adventures/utils'
import { DifficultyViewer } from '../Symbols'
import AdventureTickPanel from 'Components/Adventures/TickPanel'

const Fields = () => {
	const { currentAdventure } = useAdventureStateContext()
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
				<Field className={'no-padding'}>{currentAdventure.bio}</Field>
			</FieldRow>
			<FieldRow borderBottom>
				<Field borderRight>
					<FieldHeader text={'Distance'} />
					<FieldValue className={'flex-box'}>
						<DistanceIcon />
						{getContent('adventurePanel.fields.approachContent', [
							Math.round(currentAdventure.distance * 100) / 100
						])}
					</FieldValue>
				</Field>
				<Field>
					<FieldHeader text={getContent('adventurePanel.fields.difficulty')} />
					<FieldValue>
						<DifficultyViewer difficulty={currentAdventure.difficulty} />
					</FieldValue>
				</Field>
			</FieldRow>
			{pitchClimbs.includes(currentAdventure.climb_type) && (
				<FieldRow borderBottom>
					<Field>
						<FieldHeader text={'Pro'} />
						<FieldValue>{currentAdventure.protection}</FieldValue>
					</Field>
				</FieldRow>
			)}
			<FieldRow borderBottom>
				<Field borderRight>
					<FieldHeader text={getContent('adventurePanel.fields.elevation')} />
					<FieldValue className='flex-box'>
						<ElevationIcon />
						{getContent('adventurePanel.fields.elevationContent', [
							currentAdventure.base_elevation,
							currentAdventure.summit_elevation
						])}
					</FieldValue>
				</Field>
				<Field borderRight>
					<FieldHeader text={'Climb'} />
					<FieldValue className='flex-box'>{currentAdventure.climb?.toString()} ft</FieldValue>
				</Field>
				<Field>
					<FieldHeader text={'Descent'} />
					<FieldValue className='flex-box'>{currentAdventure.descent?.toString()} ft</FieldValue>
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
			<FieldRow></FieldRow>
			{loggedInUser && <AdventureTickPanel />}
		</FieldPage>
	)
}

export default Fields
