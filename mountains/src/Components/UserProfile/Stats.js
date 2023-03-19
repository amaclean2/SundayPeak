import cx from 'classnames'
import { useEditUser, useUserStateContext } from 'sundaypeak-treewells'

import StatTemplate from './StatTemplate'

const Stats = ({ className }) => {
	const { workingUser, statState } = useUserStateContext()
	const { changeUserStatState } = useEditUser()

	return (
		<div className={cx('stats-container', 'stats', 'flex-box', className)}>
			<StatTemplate
				statLabel={'Completed'}
				statValue={workingUser?.completed_adventures.length.toString()}
				selected={statState === 'completed'}
				onClick={() => changeUserStatState('completed')}
			/>
			<StatTemplate
				statLabel={'Friends'}
				statValue={workingUser?.friends.length.toString()}
				selected={statState === 'friends'}
				onClick={() => changeUserStatState('friends')}
			/>
			<div className='flex-spacer' />
		</div>
	)
}

export default Stats
