import cx from 'classnames'
import {
	CARD_TYPES,
	useCardStateContext,
	useGetAdventure,
	useUserStateContext
} from '../../Providers'
import { FieldHeader, FlexSpacer } from '../Reusable'

const Tick = ({ onClick, tick }) => (
	<li
		onClick={onClick}
		className='tick drop-list-item flex-box'
	>
		{tick.adventure_name}
		<span className='drop-list-subtext'>{tick.adventure_type}</span>
	</li>
)

const UserTickPanel = ({ className }) => {
	const { workingUser } = useUserStateContext()
	const { cardDispatch } = useCardStateContext()
	const { getAdventure } = useGetAdventure()

	const openAdventure = (adventureId) => {
		return getAdventure({ id: adventureId }).then(() => {
			cardDispatch({ type: 'switchCard', payload: CARD_TYPES.adventures })
		})
	}

	return (
		<div className={cx(className, 'tick-list-container flex-box')}>
			<FieldHeader className='label-field'>Hit List</FieldHeader>
			<ul className='tick-list flex-box'>
				{workingUser.ticks?.map((tick, key) => (
					<Tick
						onClick={() => openAdventure(tick.adventure_id)}
						tick={tick}
						key={`user_tick_${key}`}
					/>
				))}
			</ul>
		</div>
	)
}

export default UserTickPanel
