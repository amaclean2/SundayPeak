import cx from 'classnames'
import { useNavigate } from 'react-router-dom'
import { useGetAdventures, useUserStateContext } from 'sundaypeak-treewells'

import { FieldHeader } from 'Components/Reusable'

const TodoAdventure = ({ onClick, tick }) => (
	<li
		onClick={onClick}
		className='tick drop-list-item flex-box'
	>
		<span className={'main-text'}>{tick.adventure_name}</span>
		<span className='drop-list-subtext'>{tick.adventure_type}</span>
	</li>
)

const UserTodoPanel = ({ className }) => {
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
			<FieldHeader className='label-field'>Todo List</FieldHeader>
			<ul className='tick-list flex-box'>
				{workingUser.todo_adventures?.map((adventure, key) => (
					<TodoAdventure
						onClick={() => openAdventure(adventure.adventure_id, adventure.adventure_type)}
						tick={adventure}
						key={`user_todo_adventure_${key}`}
					/>
				))}
			</ul>
		</div>
	)
}

export default UserTodoPanel
