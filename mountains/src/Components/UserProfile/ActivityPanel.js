import { useEffect, useState } from 'react'
import cx from 'classnames'

import {
	CARD_STATES,
	useCardStateContext,
	useGetAdventure,
	useUserStateContext
} from '../../Providers'
import { FieldHeader } from '../Reusable'

const Activity = ({ activityName, onClick }) => (
	<span
		onClick={onClick}
		className='tick'
	>
		{activityName}
	</span>
)

const ActivityPanel = ({ className }) => {
	const { workingUser } = useUserStateContext()
	const { switchCard } = useCardStateContext()
	const { getAdventure } = useGetAdventure()

	const [activities, setActivities] = useState(null)

	useEffect(() => {
		if (workingUser?.activities) {
			setActivities(workingUser.activities)
		}
	}, [workingUser])

	const openAdventure = (adventureId) => {
		return getAdventure({ id: adventureId }).then(() => {
			switchCard(CARD_STATES.adventures)
		})
	}

	return (
		<div className={cx(className, 'tick-list-container flex-box')}>
			<FieldHeader className='label-field'>Completed Activities</FieldHeader>
			<div className='tick-list flex-box'>
				{activities?.map((activity, key) => (
					<Activity
						onClick={() => openAdventure(activity.adventure_id)}
						activityName={activity.adventure_name}
						key={`user_activity_${key}`}
					/>
				))}
			</div>
		</div>
	)
}

export default ActivityPanel