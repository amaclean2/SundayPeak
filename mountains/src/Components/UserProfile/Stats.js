import cx from 'classnames'
import { useEditUser, useUserStateContext } from '@amaclean2/sundaypeak-treewells'

import StatTemplate from './StatTemplate'

const Stats = ({ className }) => {
	const { workingUser, statView } = useUserStateContext()
	const { changeUserStatView } = useEditUser()

	return (
		<div className={cx('stats-container', 'stats', 'flex-box', className)}>
			<StatTemplate
				statLabel={'Completed'}
				statValue={workingUser?.completed_adventures.length.toString()}
				selected={statView === 'completed'}
				onClick={() => changeUserStatView('completed')}
			/>
			<StatTemplate
				statLabel={'Friends'}
				statValue={workingUser?.friends.length.toString()}
				selected={statView === 'friends'}
				onClick={() => changeUserStatView('friends')}
			/>
			<div className='flex-spacer' />
		</div>
	)
}

export default Stats
