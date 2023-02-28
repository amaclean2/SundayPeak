import cx from 'classnames'
import { useUserStateContext } from '../../Providers'
import StatTemplate from './StatTemplate'

const Stats = ({ className }) => {
	const { workingUser, userDispatch } = useUserStateContext()

	return (
		<div className={cx('stats-container', 'stats', 'flex-box', className)}>
			<StatTemplate
				statLabel={'Completed'}
				statValue={workingUser?.activity_count}
				onClick={() => userDispatch({ type: 'selectListState', payload: 'completed' })}
			/>
			<StatTemplate
				statLabel={'Friends'}
				statValue={workingUser?.friend_count}
				onClick={() => userDispatch({ type: 'selectListState', payload: 'friends' })}
			/>
			<div className='flex-spacer' />
		</div>
	)
}

export default Stats
