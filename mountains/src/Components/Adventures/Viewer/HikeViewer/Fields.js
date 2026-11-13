import { useAdventureStateContext, useUserStateContext } from 'State'
import { ParentSize } from '@visx/responsive'
import React from 'react'
import Linkify from 'linkify-react'

import { formatSeasons } from 'Components/Adventures/utils'
import ElevationChart from 'Components/Reusable/Chart'
import AdventureTickPanel from 'Components/Adventures/TickPanel'
import NearbyCards from 'Components/Reusable/NearbyCard'
import { Button, Field, FieldHeader, FieldPage, FieldRow, FieldValue } from 'Components/Reusable'
import RatingView from 'Components/Reusable/RatingView'
import Breadcrumb from 'Components/Reusable/Breadcrumb'
import AdventureTitle from '../AdventureTitle'
import AdventureTypeTag from '../AdventureTypeTag'
import getContent from 'TextContent'
import { DistanceIcon, ElevationIcon, Pin } from 'Images'

import AdventureGallery from '../../Gallery'
import { DifficultyViewer } from '../Symbols'

const Fields = ({ menuContents }) => {
	const { currentAdventure, workingPath, closeAdventures } = useAdventureStateContext()
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
					<FieldHeader text={'Distance'} />
					<FieldValue className={'flex-box'}>
						<DistanceIcon />
						{getContent('adventurePanel.fields.approachContent', [
							(
								currentAdventure.elevations?.[currentAdventure.elevations.length - 1]?.[1] ??
								currentAdventure.distance ??
								0
							).toFixed(2)
						])}
					</FieldValue>
				</Field>
				<Field>
					<FieldHeader text={getContent('adventurePanel.fields.elevation')} />
					<FieldValue className='flex-box'>
						<ElevationIcon />
						{getContent('adventurePanel.fields.elevationContent', [
							[Infinity, -Infinity, undefined].includes(workingPath.minEl) ? 0 : workingPath.minEl,
							[Infinity, -Infinity, undefined].includes(workingPath.maxEl) ? 0 : workingPath.maxEl
						])}
					</FieldValue>
				</Field>
			</FieldRow>

			<FieldRow className={'descriptor-row'}>
				<Field>
					<FieldHeader text={getContent('adventurePanel.fields.difficulty')} />
					<FieldValue>
						<DifficultyViewer difficulty={currentAdventure.difficulty} />
					</FieldValue>
				</Field>
				<Field>
					<FieldHeader text={'Climb'} />
					<FieldValue>{currentAdventure.climb} ft</FieldValue>
				</Field>
				<Field>
					<FieldHeader text={'Descent'} />
					<FieldValue>{currentAdventure.descent} ft</FieldValue>
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

			<FieldRow className={'card-row'}>
				<Field cardField>
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
