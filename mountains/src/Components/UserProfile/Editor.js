import { useEffect, useState } from 'react'

import { useEditUser, useUserStateContext } from 'Providers'
import { ErrorField, FormField, MultiField } from 'Components/Reusable'
import ProfileImageUploader from './ProfileImageUploader'

const UserEditor = () => {
	const { workingUser, editUser } = useUserStateContext()
	const { getMapboxStyles } = useEditUser()
	const [styles, setStyles] = useState()

	useEffect(() => {
		getMapboxStyles().then((mapboxStyles) =>
			setStyles(
				Object.keys(mapboxStyles).map((style, key) => ({
					id: key,
					value: mapboxStyles[style],
					text: style
				}))
			)
		)
	}, [])

	if (!styles) return

	return (
		<div className='adventure-info flex-box'>
			<ProfileImageUploader />
			<ErrorField form={'user'} />
			<MultiField
				onChange={editUser}
				label={'Name'}
				fields={[
					{
						type: 'text',
						name: 'first_name',
						value: workingUser.first_name
					},
					{
						type: 'text',
						name: 'last_name',
						value: workingUser.last_name
					}
				]}
			/>
			<FormField
				name='city'
				label='Location'
				isEditable
				fullWidth
				placeholder={'City, State'}
				value={workingUser.city}
				onChange={editUser}
			/>
			<FormField
				name='email'
				label='Email'
				type='email'
				isEditable
				fullWidth
				value={workingUser.email}
				onChange={editUser}
			/>
			<FormField
				name='phone'
				label='Phone'
				type='tel'
				isEditable
				fullWidth
				value={workingUser.phone}
				options={{ pattern: '[0-9]{3} [0-9]{3} [0-9]{4}' }}
				onChange={editUser}
			/>
			<FormField
				name='user_site'
				label='User Website'
				isEditable
				fullWidth
				placeholder={'example.com'}
				value={workingUser.user_site}
				onChange={editUser}
			/>
			<FormField
				name='sex'
				label='Gender'
				type='select'
				isEditable
				fullWidth
				options={{
					selectOptions: [
						{
							id: 0,
							value: 0,
							text: 'Male'
						},
						{
							id: 1,
							text: 'Female',
							value: 1
						},
						{
							id: 2,
							text: 'Non-binary',
							value: 2
						},
						{
							id: 3,
							text: 'Prefer not to say',
							value: 3
						}
					]
				}}
				value={workingUser.sex}
				onChange={editUser}
			/>
			<FormField
				type='select'
				name='map_style'
				label='Map Style'
				isEditable
				fullWidth
				value={workingUser.map_style}
				onChange={editUser}
				options={{
					selectOptions: styles
				}}
			/>
			<FormField
				name='bio'
				label='Bio'
				type='textarea'
				isEditable
				fullWidth
				value={workingUser.bio || ''}
				onChange={editUser}
			/>
		</div>
	)
}

export default UserEditor
