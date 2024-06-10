import React from 'react'

import { Button, Field, FieldHeader, FieldPage, FieldRow, FieldValue } from 'Components/Reusable'
import RatingView from 'Components/Reusable/RatingView'
import { useAdventureStateContext, useUserStateContext } from '@amaclean2/sundaypeak-treewells'
import { AngleIcon, ElevationIcon, Pin } from 'Images'
import getContent from 'TextContent'
import { Aspect, DifficultyViewer, ExposureViewer } from '../Symbols'
import { formatSeasons } from 'Components/Adventures/utils'
import AdventureTickPanel from 'Components/Adventures/TickPanel'
import { ParentSize } from '@visx/responsive'
import ElevationChart from 'Components/Reusable/Chart'
import Linkify from 'linkify-react'
import NearbyCards from 'Components/Reusable/NearbyCard'
import AdventureGallery from 'Components/Adventures/Gallery'
import Breadcrumb from 'Components/Reusable/Breadcrumb'

const Fields = ({ menuContents }) => {
	const { currentAdventure, closeAdventures } = useAdventureStateContext()
	const { loggedInUser } = useUserStateContext()

	return (
		<FieldPage className={'adventure-display-grid'}>
			{currentAdventure?.breadcrumb?.length > 1 && (
				<FieldRow className={'narrow-field'}>
					<Field noPadding>
						<Breadcrumb />
					</Field>
				</FieldRow>
			)}

			<FieldRow className={'location-row'}>
				<Field className={'view-location'}>
					<Pin size={20} />
					{currentAdventure.nearest_city}
				</Field>
			</FieldRow>

			<FieldRow className={'narrow-field'}>
				<Field noPadding>
					<RatingView ratingCount={Number(currentAdventure?.rating.split(':')[0])} />
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

			<FieldRow borderBottom>
				<Field borderRight>
					<FieldHeader text={getContent('adventurePanel.fields.slopeAngle')} />
					<FieldValue className='flex-box'>
						<AngleIcon size={25} />
						{currentAdventure.avg_angle === currentAdventure.max_angle
							? `${currentAdventure.avg_angle}°`
							: `${currentAdventure.avg_angle} - ${currentAdventure.max_angle}°`}
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

			<FieldRow>
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

			{currentAdventure.elevations?.length && (
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
			)}

			<FieldRow>
				<Field cardField>
					<FieldHeader
						text={'Nearby Adventures'}
						largeHeader
					/>
					<NearbyCards adventures={closeAdventures} />
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

			{loggedInUser && <AdventureTickPanel />}
		</FieldPage>
	)
}

export default Fields
