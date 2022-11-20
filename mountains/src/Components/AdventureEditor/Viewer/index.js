import { AngleIcon, DistanceIcon, ElevationIcon } from '../../../Images/LabelIcons'
import { useAdventureStateContext, useUserStateContext } from '../../../Providers'
import getContent from '../../../TextContent'
import { Degrees, Field, FieldHeader, FieldPage, FieldRow, FieldValue } from '../../Reusable'
import AdventureGallery from '../Gallery'
import GearList from '../GearList'
import SeasonList from '../SeasonList'
import AdventureTickPanel from '../TickPanel'
import { Aspect, DifficultyViewer, ExposureViewer } from './Symbols'

const AdventureViewer = () => {
	const { currentAdventure } = useAdventureStateContext()
	const { loggedInUser } = useUserStateContext()

	return (
		<div className='adventure-viewer flex-box'>
			{currentAdventure.id && currentAdventure.id !== 'waiting' && <AdventureGallery />}
			<FieldPage>
				<FieldRow className='adventure-bio'>
					<Field>{currentAdventure.bio}</Field>
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
							<Degrees />
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
								Number(currentAdventure.elevation) - Number(currentAdventure.gain),
								currentAdventure.elevation
							])}
						</FieldValue>
					</Field>
				</FieldRow>
				<FieldRow borderBottom>
					<Field>
						<FieldHeader text={getContent('adventurePanel.fields.gear')} />
						<FieldValue>
							<GearList gear={currentAdventure.gear} />
						</FieldValue>
					</Field>
				</FieldRow>
				<FieldRow borderBottom>
					<Field>
						<FieldHeader text={getContent('adventurePanel.fields.bestSeason')} />
						<FieldValue>
							<SeasonList seasons={currentAdventure.season} />
						</FieldValue>
					</Field>
				</FieldRow>
				{loggedInUser && <AdventureTickPanel />}
			</FieldPage>
		</div>
	)
}

export default AdventureViewer
