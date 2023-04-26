import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useAdventureStateContext, useUserStateContext } from '@amaclean2/sundaypeak-treewells'

import { AngleIcon, DistanceIcon, ElevationIcon } from 'Images/Symbols/LabelIcons'
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
import { formatGearList, formatSeasons } from '../utils'
import { Aspect, DifficultyViewer, ExposureViewer } from './Symbols'
import { Pin } from 'Images'

const SkiViewer = ({ menuContents }) => {
	const { currentAdventure } = useAdventureStateContext()
	const { loggedInUser } = useUserStateContext()
	const navigate = useNavigate()

	return (
		<DisplayCard
			title={currentAdventure.adventure_name}
			menu={menuContents}
			onClose={() => navigate('/discover')}
		>
			<AdventureGallery />
			<FieldPage className={'adventure-display-grid'}>
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
						<FieldHeader text={getContent('adventurePanel.fields.difficulty')} />
						<FieldValue>
							<DifficultyViewer difficulty={currentAdventure.difficulty} />
						</FieldValue>
					</Field>
					<Field borderRight>
						<FieldHeader text={getContent('adventurePanel.fields.exposure')} />
						<FieldValue>
							<ExposureViewer exposure={currentAdventure.exposure} />
						</FieldValue>
					</Field>
					<Field borderRight>
						<FieldHeader text={getContent('adventurePanel.fields.slopeAngle')} />
						<FieldValue className='flex-box'>
							<AngleIcon />
							{getContent('adventurePanel.fields.angleRange', [
								currentAdventure.avg_angle,
								currentAdventure.max_angle
							])}
						</FieldValue>
					</Field>
					<Field>
						<FieldHeader text={getContent('adventurePanel.fields.aspect')} />
						<FieldValue>
							<Aspect aspect={currentAdventure.aspect} />
						</FieldValue>
					</Field>
				</FieldRow>
				<FieldRow borderBottom>
					<Field borderRight>
						<FieldHeader text={getContent('adventurePanel.fields.approach')} />
						<FieldValue className='flex-box'>
							<DistanceIcon />
							{getContent('adventurePanel.fields.approachContent', [
								currentAdventure.approach_distance
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
					<Field>
						<FieldHeader text={getContent('adventurePanel.fields.gear')} />
						<FieldValue>
							{formatGearList({
								gear: currentAdventure.gear?.length ? JSON.parse(currentAdventure.gear) : []
							})}
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
				<FieldRow></FieldRow>
				{loggedInUser && <AdventureTickPanel />}
			</FieldPage>
		</DisplayCard>
	)
}

SkiViewer.propTypes = {
	menuContents: PropTypes.shape({
		fields: FieldProps
	})
}

export default SkiViewer
