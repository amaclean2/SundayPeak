import { useNavigate } from 'react-router-dom'
import cx from 'classnames'
import { useAdventureStateContext } from '@amaclean2/sundaypeak-treewells'

import { FieldHeader, FlexSpacer } from 'Components/Reusable'

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
	const navigate = useNavigate()

	const todos = currentAdventure?.todo_users

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
						onClick={() => navigate(`/user/${todo.user_id}`)}
					>
						<UserImage url={todo.profile_picture_url} />
						{todo.display_name}
						<FlexSpacer />
					</li>
				))}
			</ul>
		</div>
	)
}

export default AdventureTickPanel
