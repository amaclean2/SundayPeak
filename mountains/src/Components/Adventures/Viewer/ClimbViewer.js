import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useAdventureStateContext, useUserStateContext } from 'sundaypeak-treewells'

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
import { Pin } from 'Images'

const ClimbViewer = ({ menuContents }) => {
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
							<Button direction={`/user/${currentAdventure.creator_id}`}>
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

ClimbViewer.propTypes = {
	menuContents: PropTypes.shape({
		fields: FieldProps
	})
}

export default ClimbViewer
