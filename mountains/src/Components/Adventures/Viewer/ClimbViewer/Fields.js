import {
	gradeConverter,
	useAdventureStateContext,
	useUserStateContext
} from '@amaclean2/sundaypeak-treewells'
import AdventureTickPanel from 'Components/Adventures/TickPanel'
import { formatSeasons, pitchClimbs } from 'Components/Adventures/utils'
import { Button, Field, FieldHeader, FieldPage, FieldRow, FieldValue } from 'Components/Reusable'
import NearbyCards from 'Components/Reusable/NearbyCard'
import RatingView from 'Components/Reusable/RatingView'
import { Pin } from 'Images'
import getContent from 'TextContent'
import Linkify from 'linkify-react'
import React from 'react'

const ClimbFields = () => {
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
					<FieldHeader text={'Type'} />
					<FieldValue>{currentAdventure.climb_type}</FieldValue>
				</Field>
				<Field borderRight>
					<FieldHeader text={'Grade'} />
					<FieldValue>
						{gradeConverter(currentAdventure?.difficulty, currentAdventure?.climb_type)}
					</FieldValue>
				</Field>
				<Field>
					<FieldHeader text={'First Ascent'} />
					<FieldValue>{currentAdventure.first_ascent}</FieldValue>
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
				<Field>
					<FieldHeader text={'Approach'} />
					<FieldValue>{currentAdventure.approach}</FieldValue>
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

export default ClimbFields
