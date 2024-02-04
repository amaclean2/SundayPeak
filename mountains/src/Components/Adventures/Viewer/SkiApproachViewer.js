import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import {
	useAdventureStateContext,
	useUserStateContext,
	useManipulateFlows
} from '@amaclean2/sundaypeak-treewells'

import { DistanceIcon, ElevationIcon } from 'Images/Symbols/LabelIcons'
import getContent from 'TextContent'
import {
	Button,
	DisplayCard,
	Field,
	FieldHeader,
	FieldPage,
	FieldProps,
	FieldRow,
	FieldValue
} from 'Components/Reusable'
import AdventureGallery from '../Gallery'
import AdventureTickPanel from '../TickPanel'
import { formatSeasons, pitchClimbs } from '../utils'
import { DifficultyViewer } from './Symbols'
import { Pin } from 'Images'
import RatingView from 'Components/Reusable/RatingView'
import ElevationView from './BikeViewer/ElevationView'

const SkiApproachViewer = ({ menuContents }) => {
	const { currentAdventure } = useAdventureStateContext()
	const { closeAdventureView } = useManipulateFlows()
	const { loggedInUser } = useUserStateContext()
	const navigate = useNavigate()

	return (
		<DisplayCard
			title={currentAdventure.adventure_name}
			menu={menuContents}
			onClose={() => {
				navigate('/discover')
				closeAdventureView()
			}}
		>
			{currentAdventure.elevations?.length && <ElevationView />}
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
				{pitchClimbs.includes(currentAdventure.climb_type) && (
					<FieldRow borderBottom>
						<Field>
							<FieldHeader text={'Pro'} />
							<FieldValue>{currentAdventure.protection}</FieldValue>
						</Field>
					</FieldRow>
				)}
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
		</DisplayCard>
	)
}

SkiApproachViewer.propTypes = {
	menuContents: PropTypes.shape({
		fields: FieldProps
	})
}

export default SkiApproachViewer
