import {
	useCardStateContext,
	useEditUser,
	useFollowUser,
	useUserStateContext
} from '../../../Providers'
import getContent from '../../../TextContent'
import Menu from '../../Reusable/Menu'

const UserEditorMenu = () => {
	const { workingUser, loggedInUser, isUserEditable, userDispatch } = useUserStateContext()
	const { cardDispatch } = useCardStateContext()
	const { handleSaveEditUser } = useEditUser()
	const { followUser } = useFollowUser()
	const menuFields = []

	const handleEdit = () => {
		if (isUserEditable) {
			handleSaveEditUser()
			cardDispatch({
				type: 'openAlert',
				payload: `${workingUser.first_name} ${workingUser.last_name}'s profile has been updated`
			})
		}
		userDispatch({ type: 'toggleIsUserEditable' })
	}

	if (workingUser.id === loggedInUser.id) {
		menuFields.push({
			action: handleEdit,
			id: 'edit-user-button',
			text: isUserEditable ? getContent('buttonText.saveUser') : getContent('buttonText.editUser')
		})

		if (isUserEditable) {
			menuFields.push({
				action: () => userDispatch({ type: 'toggleIsUserEditable' }),
				id: 'profile-edit-cancel-button',
				text: getContent('buttonText.cancel')
			})
		} else {
			menuFields.push({
				action: () =>
					userDispatch({ type: 'logout' }).then(() => cardDispatch({ type: 'closeCard' })),
				id: 'logout-button',
				text: getContent('buttonText.logout')
			})
		}
	} else {
		menuFields.push({
			action: () => followUser({ leaderId: workingUser.id, followerId: loggedInUser.id }),
			id: 'follow-user-button',
			text: getContent('buttonText.follow', [workingUser.first_name])
		})
		menuFields.push({
			action: () => {},
			id: 'message-user-button',
			disabled: true,
			text: getContent('buttonText.message', [workingUser.first_name])
		})
	}

	return <Menu fields={menuFields} />
}

export default UserEditorMenu
