import React from 'react'

import { Button, Field, FieldHeader, FieldPage, FieldRow, FieldValue } from 'Components/Reusable'
import RatingView from 'Components/Reusable/RatingView'
import { useAdventureStateContext, useUserStateContext } from '@amaclean2/sundaypeak-treewells'
import { AngleIcon, ElevationIcon, Pin } from 'Images'
import getContent from 'TextContent'
import { Aspect, DifficultyViewer, ExposureViewer } from '../Symbols'
import { formatSeasons } from 'Components/Adventures/utils'
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
			{/* new field row */}
			<FieldRow className={'location-row'}>
				<Field className={'view-location'}>
					<Pin size={20} />
					{currentAdventure.nearest_city}
				</Field>
			</FieldRow>
			<FieldRow className='adventure-bio'>
				<Field longText>{currentAdventure.bio}</Field>
			</FieldRow>
			{/* new field row */}
			<FieldRow borderBottom>
				<Field borderRight>
					<FieldHeader text={getContent('adventurePanel.fields.difficulty')} />
					<FieldValue>
						<DifficultyViewer difficulty={currentAdventure.difficulty} />
					</FieldValue>
				</Field>
				<Field>
					<FieldHeader text={getContent('adventurePanel.fields.exposure')} />
					<FieldValue>
						<ExposureViewer exposure={currentAdventure.exposure} />
					</FieldValue>
				</Field>
			</FieldRow>
			{/* new field row */}
			<FieldRow borderBottom>
				<Field borderRight>
					<FieldHeader text={getContent('adventurePanel.fields.slopeAngle')} />
					<FieldValue className='flex-box'>
						<AngleIcon size={25} />
						{getContent('adventurePanel.fields.angleRange', [
							currentAdventure.avg_angle,
							currentAdventure.max_angle
						])}
					</FieldValue>
				</Field>
				<Field borderRight>
					<FieldHeader text={getContent('adventurePanel.fields.aspect')} />
					<FieldValue>
						<Aspect aspect={currentAdventure.aspect} />
					</FieldValue>
				</Field>
				<Field>
					<FieldHeader text={getContent('adventurePanel.fields.elevation')} />
					<FieldValue className='flex-box'>
						<ElevationIcon />
						{getContent('adventurePanel.fields.elevationContent', [
							currentAdventure.summit_elevation,
							currentAdventure.base_elevation
						])}
					</FieldValue>
				</Field>
			</FieldRow>
			{/* new field row */}
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
			{/* new field row */}
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
			<FieldRow />
			{loggedInUser && <AdventureTickPanel />}
		</FieldPage>
	)
}

export default Fields
