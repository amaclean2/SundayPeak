import { ElevationIcon } from 'Images/LabelIcons'
import { useAdventureStateContext, useUserStateContext } from '../../../Providers'
import getContent from '../../../TextContent'
import { Field, FieldHeader, FieldPage, FieldRow, FieldValue } from '../../Reusable'
import AdventureGallery from '../Gallery'
import SeasonList from '../SeasonList'
import AdventureTickPanel from '../TickPanel'
import { pitchClimbs } from '../utils'
import { DifficultyViewer } from './Symbols'

const HikeViewer = () => {
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
						<FieldHeader text={'Distance'} />
						<FieldValue>{currentAdventure.distance}</FieldValue>
					</Field>
					<Field borderRight>
						<FieldHeader text={getContent('adventurePanel.fields.elevation')} />
						<FieldValue className='flex-box'>
							<ElevationIcon />
							{getContent('adventurePanel.fields.elevationContent', [
								Number(currentAdventure.elevation) - Number(currentAdventure.gain),
								currentAdventure.elevation
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

export default HikeViewer
