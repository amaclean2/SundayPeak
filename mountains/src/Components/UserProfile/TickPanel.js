import cx from 'classnames'
import { useNavigate } from 'react-router-dom'
import { useGetAdventures, useUserStateContext } from '@amaclean2/sundaypeak-treewells'

import { FieldHeader } from 'Components/Reusable'
import { LargeClimberIcon, LargeHikerIcon, LargeSkierIcon } from 'Images'

const ICON_SIZE = 25

const TodoAdventure = ({ onClick, tick }) => (
	<li
		onClick={onClick}
		className='tick drop-list-item flex-box'
	>
		<span className='drop-list-image'>
			{tick.adventure_type === 'ski' && <LargeSkierIcon size={ICON_SIZE} />}
			{tick.adventure_type === 'climb' && <LargeClimberIcon size={ICON_SIZE} />}
			{tick.adventure_type === 'hike' && <LargeHikerIcon size={ICON_SIZE} />}
		</span>
		<span className={'main-text'}>{tick.adventure_name}</span>
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
