import React from 'react'
import Linkify from 'linkify-react'
import { useAdventureStateContext, useUserStateContext } from 'State'
import { ParentSize } from '@visx/responsive'

import { Button, Field, FieldHeader, FieldPage, FieldRow, FieldValue } from 'Components/Reusable'
import RatingView from 'Components/Reusable/RatingView'
import ElevationChart from 'Components/Reusable/Chart'
import AdventureTickPanel from 'Components/Adventures/TickPanel'
import NearbyCards from 'Components/Reusable/NearbyCard'
import { DistanceIcon, ElevationIcon, Pin } from 'Images'
import getContent from 'TextContent'

import { DifficultyViewer } from '../Symbols'
import AdventureGallery from '../../Gallery'
import Breadcrumb from 'Components/Reusable/Breadcrumb'
import AdventureTitle from '../AdventureTitle'
import AdventureTypeTag from '../AdventureTypeTag'

const Fields = () => {
	const { loggedInUser } = useUserStateContext()
	const { currentAdventure, closeAdventures } = useAdventureStateContext()

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

			<FieldRow className={'descriptor-row'}>
				<Field>
					<FieldHeader text={'Distance'} />
					<FieldValue className={'flex-box'}>
						<DistanceIcon />
						{getContent('adventurePanel.fields.approachContent', [
							currentAdventure.elevations?.length
								? Math.round(
										currentAdventure.elevations[currentAdventure.elevations.length - 1][1] * 100
								  ) / 100
								: 0
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
				<Field>
					<FieldHeader text={getContent('adventurePanel.fields.difficulty')} />
					<FieldValue>
						<DifficultyViewer difficulty={currentAdventure.difficulty} />
					</FieldValue>
				</Field>
			</FieldRow>

			<FieldRow className='adventure-bio'>
				<Field
					noPadding
					longText
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

			{closeAdventures?.length > 1 && (
				<FieldRow className={'card-row'}>
					<Field cardField>
						<FieldHeader
							text={'Nearby Approaches'}
							largeHeader
						/>
						<NearbyCards adventures={closeAdventures} />
					</Field>
				</FieldRow>
			)}

			{loggedInUser && <AdventureTickPanel />}
		</FieldPage>
	)
}

export default Fields
