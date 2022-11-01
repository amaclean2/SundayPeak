import { useEffect, useState } from 'react'
import {
	CARD_STATES,
	useAdventureEditContext,
	useCardStateContext,
	useGetUser,
	useUserStateContext
} from '../../Providers'
import { Field, FieldHeader, FieldRow, FlexSpacer } from '../Reusable'

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
	const { currentAdventure } = useAdventureEditContext()
	const { switchCard } = useCardStateContext()
	const { getOtherUser } = useGetUser()
	const { workingUser } = useUserStateContext()

	const [ticks, setTicks] = useState(null)
	const [userOnLoad, setUserOnLoad] = useState()

	useEffect(() => {
		workingUser?.id && setUserOnLoad(workingUser.id)
	}, [])

	useEffect(() => {
		if (currentAdventure?.ticks) {
			setTicks(currentAdventure.ticks)
		}
	}, [currentAdventure])

	useEffect(() => {
		if (userOnLoad && workingUser?.id && userOnLoad !== workingUser?.id) {
			switchCard(CARD_STATES.profile)
		}
	}, [workingUser])

	if (!ticks || !ticks.length) {
		return null
	}

	return (
		<FieldRow>
			<Field>
				<FieldHeader text='BYF' />
				<ul className='tick-list'>
					{ticks.map((tick, key) => (
						<li
							key={`user_${key}`}
							className={'tick flex-box multi-field-tick'}
							onClick={() => getOtherUser({ userId: tick.user_id })}
						>
							<UserImage url={tick.profile_picture_url} />
							<FlexSpacer />
							{tick.first_name} {tick.last_name}
							<FlexSpacer />
							<FlexSpacer />
							<FlexSpacer />
							<MailIcon />
						</li>
					))}
				</ul>
			</Field>
		</FieldRow>
	)
}

export default AdventureTickPanel
