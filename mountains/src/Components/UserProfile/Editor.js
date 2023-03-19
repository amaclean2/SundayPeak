import { useNavigate } from 'react-router-dom'

import {
	Button,
	DisplayCard,
	ErrorField,
	FooterButtons,
	FormField,
	MultiField
} from 'Components/Reusable'
import ProfileImageUploader from './ProfileImageUploader'
import { useEditUser, useUserStateContext } from 'sundaypeak-treewells'

const UserEditor = () => {
	const { workingUser } = useUserStateContext()
	const { editUser } = useEditUser()
	const navigate = useNavigate()

	if (!workingUser) return null

	return (
		<DisplayCard title={'My Profile'}>
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
				name='bio'
				label='Bio'
				type='textarea'
				isEditable
				fullWidth
				value={workingUser.bio || ''}
				onChange={editUser}
			/>
			<FooterButtons>
				<Button onClick={() => navigate('/user')}>Finish</Button>
			</FooterButtons>
		</DisplayCard>
	)
}

export default UserEditor
