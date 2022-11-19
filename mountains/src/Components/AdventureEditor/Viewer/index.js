import { AngleIcon, DistanceIcon, ElevationIcon } from '../../../Images/LabelIcons'
import { useAdventureStateContext, useUserStateContext } from '../../../Providers'
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
						<FieldHeader text='Difficulty' />
						<FieldValue>
							<DifficultyViewer difficulty={currentAdventure.difficulty} />
						</FieldValue>
					</Field>
					<Field borderRight>
						<FieldHeader text='Exposure' />
						<FieldValue>
							<ExposureViewer exposure={currentAdventure.exposure} />
						</FieldValue>
					</Field>
					<Field borderRight>
						<FieldHeader text='Slope Angle' />
						<FieldValue className='flex-box'>
							<AngleIcon />
							{currentAdventure.avg_angle} - {currentAdventure.max_angle}
							<Degrees />
						</FieldValue>
					</Field>
					<Field>
						<FieldHeader text='Aspect' />
						<FieldValue>
							<Aspect aspect={currentAdventure.aspect} />
						</FieldValue>
					</Field>
				</FieldRow>
				<FieldRow borderBottom>
					<Field borderRight>
						<FieldHeader text='Approach' />
						<FieldValue className='flex-box'>
							<DistanceIcon />
							{`${currentAdventure.approach_distance} mi`}
						</FieldValue>
					</Field>
					<Field>
						<FieldHeader text='Elevation' />
						<FieldValue className='flex-box'>
							<ElevationIcon />
							{`${Number(currentAdventure.elevation) - Number(currentAdventure.gain)} - ${
								currentAdventure.elevation
							} ft`}
						</FieldValue>
					</Field>
				</FieldRow>
				<FieldRow borderBottom>
					<Field>
						<FieldHeader text='Gear' />
						<FieldValue>
							<GearList gear={currentAdventure.gear} />
						</FieldValue>
					</Field>
				</FieldRow>
				<FieldRow borderBottom>
					<Field>
						<FieldHeader text='Best Season' />
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
