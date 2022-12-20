import {
	CARD_TYPES,
	useCardStateContext,
	useEditUser,
	useFollowUser,
	useUserStateContext
} from '../../../Providers'
import getContent from '../../../TextContent'
import Menu from '../../Reusable/Menu'

const UserEditorMenu = () => {
	const { workingUser, loggedInUser, isUserEditable, userDispatch, activeWorkingUser, friends } =
		useUserStateContext()
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

	const openChat = () => {
		cardDispatch({ type: 'switchCard', payload: CARD_TYPES.plan })
	}

	if (!loggedInUser?.id) {
		return null
	}

	if (!activeWorkingUser) {
		menuFields.push({
			action: handleEdit,
			id: 'edit-user-button',
			text: isUserEditable ? getContent('buttonText.saveUser') : getContent('buttonText.editUser')
		})

		menuFields.push({
			action: openChat,
			id: 'view-conversations-button',
			text: 'View Conversations'
		})

		menuFields.push({
			action: () => cardDispatch({ type: 'switchCard', payload: CARD_TYPES.privacy }),
			id: 'privacy-policy-button',
			text: 'View Privacy Policy'
		})

		if (isUserEditable) {
			menuFields.push({
				action: () => userDispatch({ type: 'toggleIsUserEditable' }),
				id: 'profile-edit-cancel-button',
				text: getContent('buttonText.cancel')
			})
		} else {
			menuFields.push({
				action: () => {
					userDispatch({ type: 'logout' })
					cardDispatch({ type: 'closeCard' })
				},
				id: 'logout-button',
				text: getContent('buttonText.logout')
			})
		}
	} else if (loggedInUser?.id) {
		const alreadyFollowed = friends?.some(({ id }) => loggedInUser?.id === id)
		if (!alreadyFollowed) {
			menuFields.push({
				action: () => followUser({ leaderId: workingUser.id, followerId: loggedInUser.id }),
				id: 'follow-user-button',
				text: getContent('buttonText.follow', [workingUser.first_name])
			})
		}
		menuFields.push({
			action: openChat,
			id: 'message-user-button',
			text: getContent('buttonText.message', [workingUser.first_name])
		})
	}

	return <Menu fields={menuFields} />
}

export default UserEditorMenu
