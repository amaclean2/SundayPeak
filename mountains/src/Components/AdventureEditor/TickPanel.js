import { useAdventureStateContext, useGetUser } from '../../Providers'
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
	const { currentAdventure } = useAdventureStateContext()
	const { getOtherUser } = useGetUser()

	const ticks = currentAdventure?.ticks || []

	if (!ticks || !ticks.length) {
		return null
	}

	return (
		<FieldRow>
			<Field>
				<FieldHeader text='Adventurers' />
				<ul className='tick-list'>
					{ticks.map((tick, key) => (
						<li
							key={`user_${key}`}
							className={'tick flex-box multi-field-tick'}
							onClick={() => getOtherUser({ userId: tick.user_id, profileSwitch: true })}
						>
							<UserImage url={tick.profile_picture_url} />
							{tick.first_name} {tick.last_name}
							<FlexSpacer />
							<MailIcon />
						</li>
					))}
				</ul>
			</Field>
			<FlexSpacer />
		</FieldRow>
	)
}

export default AdventureTickPanel
