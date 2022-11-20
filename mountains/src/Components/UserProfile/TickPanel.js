import cx from 'classnames'
import {
	CARD_TYPES,
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
	const { cardDispatch } = useCardStateContext()
	const getAdventure = useGetAdventure()

	const openAdventure = (adventureId) => {
		return getAdventure({ id: adventureId }).then(() => {
			cardDispatch({ type: 'switchCard', payload: CARD_TYPES.adventures })
		})
	}

	return (
		<div className={cx(className, 'tick-list-container flex-box')}>
			<FieldHeader className='label-field'>Todo List</FieldHeader>
			<ul className='tick-list flex-box'>
				{workingUser.ticks?.map((tick, key) => (
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
