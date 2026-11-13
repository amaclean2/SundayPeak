import Linkify from 'linkify-react'
import React from 'react'
import {
	gradeConverter,
	useAdventureStateContext,
	useUserStateContext
} from 'State'

import AdventureTickPanel from 'Components/Adventures/TickPanel'
import { formatSeasons, pitchClimbs } from 'Components/Adventures/utils'
import { Button, Field, FieldHeader, FieldPage, FieldRow, FieldValue } from 'Components/Reusable'
import NearbyCards from 'Components/Reusable/NearbyCard'
import RatingView from 'Components/Reusable/RatingView'
import { Pin } from 'Images'
import getContent from 'TextContent'

import AdventureGallery from '../../Gallery'
import Breadcrumb from 'Components/Reusable/Breadcrumb'
import AdventureTitle from '../AdventureTitle'
import AdventureTypeTag from '../AdventureTypeTag'

const ClimbFields = ({ menuContents }) => {
	const { currentAdventure, closeAdventures } = useAdventureStateContext()
	const { loggedInUser } = useUserStateContext()

	return (
		<FieldPage className={'adventure-display-grid'}>
			<FieldRow className={'narrow-field'}>
				<Field noPadding>
					<Breadcrumb />
				</Field>
			</FieldRow>

			<AdventureTitle />

			<FieldRow className={'location-row'}>
				<Field noPadding>
					<AdventureTypeTag />
				</Field>
				<Field className={'view-location'}>
					<Pin size={12} />
					{currentAdventure.nearest_city}
				</Field>
				<Field
					noPadding
					className={'location-rating'}
				>
					<RatingView
						ratingCount={Number(currentAdventure?.rating.split(':')[0])}
						size={16}
					/>
				</Field>
			</FieldRow>

			<FieldRow>
				<Field noPadding>
					<AdventureGallery />
				</Field>
			</FieldRow>

			<FieldRow className={'adventure-page-action-items'}>
				{menuContents?.fields
					?.filter((item) => item.viewerItem)
					?.map((item) => (
						<Button
							small
							id={item.id}
							key={item.id}
							onClick={item.action}
						>
							{item.text}
						</Button>
					))}
			</FieldRow>

			<FieldRow className={'descriptor-row'}>
				<Field>
					<FieldHeader text={'Type'} />
					<FieldValue>{currentAdventure.climb_type}</FieldValue>
				</Field>
				<Field>
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
				<FieldRow className={'descriptor-row'}>
					<Field>
						<FieldHeader text={'Protection'} />
						<FieldValue>{currentAdventure.protection}</FieldValue>
					</Field>
				</FieldRow>
			)}

			<FieldRow className={'descriptor-row'}>
				<Field>
					<FieldHeader text={'Approach'} />
					<FieldValue>{currentAdventure.approach}</FieldValue>
				</Field>
			</FieldRow>

			<FieldRow className={'descriptor-row'}>
				<Field>
					<FieldHeader text={getContent('adventurePanel.fields.bestSeason')} />
					<FieldValue>
						{currentAdventure.season?.length
							? formatSeasons({
									seasonArray: currentAdventure.season.length ? currentAdventure.season : []
							  })
							: ''}
					</FieldValue>
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

			{currentAdventure.creator && (
				<FieldRow>
					<Field>
						<FieldHeader text='Created By' />
						<FieldValue>
							<Button
								direction={`/user/${currentAdventure.creator.user_id}`}
								type='link'
							>
								{currentAdventure.creator.display_name}
							</Button>
						</FieldValue>
					</Field>
				</FieldRow>
			)}

			<FieldRow className={'card-row'}>
				<Field cardField>
					<FieldHeader
						text={'Nearby Climbs'}
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
