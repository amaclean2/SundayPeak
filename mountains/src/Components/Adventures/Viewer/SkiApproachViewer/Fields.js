import React from 'react'
import Linkify from 'linkify-react'
import { useAdventureStateContext, useUserStateContext } from '@amaclean2/sundaypeak-treewells'
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

			<FieldRow>
				<Field>
					<AdventureGallery />
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

			<FieldRow borderBottom>
				<Field borderRight>
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
				<Field>
					<FieldHeader text={getContent('adventurePanel.fields.difficulty')} />
					<FieldValue>
						<DifficultyViewer difficulty={currentAdventure.difficulty} />
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
				<FieldRow>
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
