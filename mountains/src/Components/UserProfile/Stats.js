import cx from 'classnames'
import { useEditUser, useUserStateContext } from 'State'

import StatTemplate from './StatTemplate'

const Stats = ({ className }) => {
	const { workingUser, statView } = useUserStateContext()
	const { changeUserStatView } = useEditUser()

	return (
		<div className={cx('stats-container', 'stats', 'flex-box', className)}>
			<StatTemplate
				statLabel={'Completed'}
				statValue={(workingUser?.completed_adventures?.length ?? 0).toString()}
				selected={statView === 'completed'}
				onClick={() => changeUserStatView('completed')}
			/>
			<StatTemplate
				statLabel={'Todo'}
				statValue={(workingUser?.todo_adventures?.length ?? 0).toString()}
				selected={statView === 'todo'}
				onClick={() => changeUserStatView('todo')}
			/>
			<StatTemplate
				statLabel={'Friends'}
				statValue={(workingUser?.friends?.length ?? 0).toString()}
				selected={statView === 'friends'}
				onClick={() => changeUserStatView('friends')}
			/>
		</div>
	)
}

export default Stats
