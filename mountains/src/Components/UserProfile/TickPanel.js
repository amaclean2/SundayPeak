import cx from 'classnames'
import { useEffect, useState } from 'react'
import {
	CARD_STATES,
	useCardStateContext,
	useGetAdventure,
	useUserStateContext
} from '../../Providers'
import { FieldHeader } from '../Reusable'

const Tick = ({ tickName, onClick }) => (
	<li
		onClick={onClick}
		className='tick'
	>
		{tickName}
	</li>
)

const UserTickPanel = ({ className }) => {
	const { workingUser } = useUserStateContext()
	const { switchCard } = useCardStateContext()
	const { getAdventure } = useGetAdventure()

	const [ticks, setTicks] = useState(null)

	useEffect(() => {
		if (workingUser?.ticks) {
			setTicks(workingUser.ticks)
		}
	}, [workingUser])

	const openAdventure = (adventureId) => {
		return getAdventure({ id: adventureId }).then(() => {
			switchCard(CARD_STATES.adventures)
		})
	}

	return (
		<div className={cx(className, 'tick-list-container flex-box')}>
			<FieldHeader className='label-field'>Todo List</FieldHeader>
			<ul className='tick-list flex-box'>
				{ticks?.map((tick, key) => (
					<Tick
						onClick={() => openAdventure(tick.adventure_id)}
						tickName={tick.adventure_name}
						key={`user_tick_${key}`}
					/>
				))}
			</ul>
		</div>
	)
}

export default UserTickPanel
