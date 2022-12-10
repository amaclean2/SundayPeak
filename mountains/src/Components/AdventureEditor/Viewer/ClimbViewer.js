import { useAdventureStateContext, useUserStateContext } from '../../../Providers'
import getContent from '../../../TextContent'
import { Field, FieldHeader, FieldPage, FieldRow, FieldValue } from '../../Reusable'
import AdventureGallery from '../Gallery'
import SeasonList from '../SeasonList'
import AdventureTickPanel from '../TickPanel'
import { pitchClimbs } from '../utils'

const ClimbViewer = () => {
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
						<FieldHeader text={'Type'} />
						<FieldValue>{currentAdventure.climb_type}</FieldValue>
					</Field>
					<Field borderRight>
						<FieldHeader text={'Grade'} />
						<FieldValue>{currentAdventure.grade}</FieldValue>
					</Field>
					<Field>
						<FieldHeader text={'First Ascent'} />
						<FieldValue>{currentAdventure.first_ascent}</FieldValue>
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
						<FieldHeader text={'Approach'} />
						<FieldValue>{currentAdventure.approach}</FieldValue>
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

export default ClimbViewer
