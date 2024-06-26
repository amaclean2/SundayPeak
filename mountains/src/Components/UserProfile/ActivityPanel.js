import cx from 'classnames'
import { useNavigate } from 'react-router-dom'
import { useGetAdventures, useUserStateContext } from '@amaclean2/sundaypeak-treewells'

import { FieldHeader } from '../Reusable'
import { LargeActivityIcon } from 'Images'

const ICON_SIZE = 25

const CompletedAdventure = ({ activity, onClick }) => (
	<li
		onClick={onClick}
		className='tick drop-list-item flex-box'
	>
		<span className='drop-list-image'>
			<LargeActivityIcon
				type={activity.adventure_type}
				size={ICON_SIZE}
			/>
		</span>
		<span className={'main-text'}>{activity.adventure_name}</span>
	</li>
)

const ActivityPanel = ({ className }) => {
	const { workingUser } = useUserStateContext()
	const { getAdventure } = useGetAdventures()
	const navigate = useNavigate()

	const openAdventure = (adventureId, adventureType) => {
		return getAdventure({ id: adventureId, type: adventureType }).then(() =>
			navigate(`/adventure/${adventureType}/${adventureId}`)
		)
	}

	return (
		<div className={cx(className, 'tick-list-container flex-box')}>
			<FieldHeader largeHeader>Completed Adventures</FieldHeader>
			<ul className='tick-list flex-box'>
				{workingUser.completed_adventures?.map((activity, key) => (
					<CompletedAdventure
						onClick={() => openAdventure(activity.adventure_id, activity.adventure_type)}
						activity={activity}
						key={`user_activity_${key}`}
					/>
				))}
			</ul>
		</div>
	)
}

export default ActivityPanel
