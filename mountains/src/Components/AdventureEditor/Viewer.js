import { useAdventureEditContext } from '../../Providers'
import { Field, FieldHeader, FieldPage, FieldRow } from '../Reusable'
import AdventureGallery from './Gallery'
import GearList from './GearList'
import SeasonList from './SeasonList'
import AdventureTickPanel from './TickPanel'
import { gearOptions } from './utils'

const AdventureViewer = () => {
	const { currentAdventure } = useAdventureEditContext()

	return (
		<div className='adventure-viewer flex-box'>
			<AdventureGallery />
			<FieldPage>
				<FieldRow className='adventure-bio'>
					<Field>{currentAdventure.bio}</Field>
				</FieldRow>
				<FieldRow borderBottom>
					<Field borderRight>
						<FieldHeader text='Aspect' />
						NW
					</Field>
					<Field borderRight>
						<FieldHeader text='Exposure' />3
					</Field>
					<Field borderRight>
						<FieldHeader text='Slope Angle' />
						{currentAdventure.avg_angle} - {currentAdventure.max_angle}
					</Field>
					<Field>
						<FieldHeader text='Difficulty' />
						{currentAdventure.difficulty}
					</Field>
				</FieldRow>
				<FieldRow borderBottom>
					<Field borderRight>
						<FieldHeader text='Approach' />
						{currentAdventure.approach_distance}
					</Field>
					<Field>
						<FieldHeader text='Elevation' />
						{currentAdventure.elevation} - {currentAdventure.elevation + currentAdventure.gain}
					</Field>
				</FieldRow>
				<FieldRow borderBottom>
					<Field>
						<FieldHeader text='Gear' />
						<GearList gear={currentAdventure.gear} />
					</Field>
				</FieldRow>
				<FieldRow borderBottom>
					<Field>
						<FieldHeader text='Best Season' />
						<SeasonList seasons={currentAdventure.season} />
					</Field>
				</FieldRow>
				<AdventureTickPanel />
			</FieldPage>
		</div>
	)
}

export default AdventureViewer
