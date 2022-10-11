import cx from 'classnames'
import { useUserStateContext } from '../../Providers'
import { Field, FieldHeader } from '../Reusable'
import StatTemplate from './StatTemplate'

const Location = ({ value = '' }) => (
	<Field className='location-field stat-template'>
		<FieldHeader text={'Location'} />
		{value}
	</Field>
)

const Stats = ({ className }) => {
	const { workingUser } = useUserStateContext()

	return (
		<div className={cx('stats-container', 'stats', 'flex-box', className)}>
			<StatTemplate
				statLabel={'Activities'}
				statValue={workingUser?.activity_count}
			/>
			<StatTemplate
				statLabel={'Followers'}
				statValue={workingUser?.follower_count}
			/>
			<StatTemplate
				statLabel={'Following'}
				statValue={workingUser?.following_count}
			/>
			<div className='flex-spacer' />
		</div>
	)
}

export default Stats
