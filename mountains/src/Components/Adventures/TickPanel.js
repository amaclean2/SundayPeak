import cx from 'classnames'

import { FieldHeader, FlexSpacer } from 'Components/Reusable'
import { useGetUser } from 'Hooks'
import { useAdventureStateContext } from 'Hooks/Providers'

const UserImage = ({ url }) => (
	<div className='user-image'>
		<img
			src={url}
			alt={''}
		/>
	</div>
)

const MailIcon = () => <div className='mail-icon' />

const AdventureTickPanel = () => {
	const { currentAdventure } = useAdventureStateContext()
	const { getOtherUser } = useGetUser()

	const todos = currentAdventure?.todo_users || []

	if (!todos || !todos.length) {
		return null
	}

	return (
		<div className={cx('tick-list-container flex-box')}>
			<FieldHeader className={'label-field'}>Adventurers</FieldHeader>
			<ul className='tick-list flex-box'>
				{todos.map((todo, key) => (
					<li
						key={`user_${key}`}
						className={'tick drop-list-item flex-box'}
						onClick={() => getOtherUser({ userId: todo.user_id, profileSwitch: true })}
					>
						<UserImage url={todo.profile_picture_url} />
						{todo.display_name}
						<FlexSpacer />
						<MailIcon />
					</li>
				))}
			</ul>
		</div>
	)
}

export default AdventureTickPanel
