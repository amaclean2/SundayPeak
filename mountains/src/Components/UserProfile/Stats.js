import cx from 'classnames'

import { useUserStateContext } from 'Hooks/Providers'
import StatTemplate from './StatTemplate'

const Stats = ({ className }) => {
	const { workingUser, userDispatch, listState } = useUserStateContext()

	return (
		<div className={cx('stats-container', 'stats', 'flex-box', className)}>
			<StatTemplate
				statLabel={'Completed'}
				statValue={(workingUser?.completed_adventures.length).toString()}
				selected={listState === 'completed'}
				onClick={() => userDispatch({ type: 'selectListState', payload: 'completed' })}
			/>
			<StatTemplate
				statLabel={'Friends'}
				statValue={workingUser?.friends.length.toString()}
				selected={listState === 'friends'}
				onClick={() => userDispatch({ type: 'selectListState', payload: 'friends' })}
			/>
			<div className='flex-spacer' />
		</div>
	)
}

export default Stats
