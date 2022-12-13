import cx from 'classnames'

import {
	CARD_TYPES,
	useCardStateContext,
	useGetAdventure,
	useUserStateContext
} from '../../Providers'
import { FieldHeader } from '../Reusable'

const Activity = ({ activity, onClick }) => (
	<li
		onClick={onClick}
		className='tick drop-list-item flex-box'
	>
		{activity.adventure_name}
		<span className='drop-list-subtext'>{activity.adventure_type}</span>
	</li>
)

const ActivityPanel = ({ className }) => {
	const { workingUser } = useUserStateContext()
	const { cardDispatch } = useCardStateContext()
	const { getAdventure } = useGetAdventure()

	const openAdventure = (adventureId) => {
		return getAdventure({ id: adventureId }).then(() => {
			cardDispatch({ type: 'switchCard', payload: CARD_TYPES.adventures })
		})
	}

	return (
		<div className={cx(className, 'tick-list-container flex-box')}>
			<FieldHeader className='label-field'>Completed Activities</FieldHeader>
			<ul className='tick-list flex-box'>
				{workingUser.activities?.map((activity, key) => (
					<Activity
						onClick={() => openAdventure(activity.adventure_id)}
						activity={activity}
						key={`user_activity_${key}`}
					/>
				))}
			</ul>
		</div>
	)
}

export default ActivityPanel
