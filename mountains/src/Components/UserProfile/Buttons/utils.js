import { useNavigate } from 'react-router-dom'

import getContent from 'TextContent'
import { useUserStateContext } from 'Hooks/Providers'
import { useFollowUser } from 'Hooks'

export const useUserEditorMenu = () => {
	const { workingUser, loggedInUser, userDispatch } = useUserStateContext()
	const { friendUser } = useFollowUser()
	const navigate = useNavigate()

	const buildEditorMenu = () => {
		const menuFields = []

		if (!loggedInUser) {
			return null
		}

		if (workingUser === loggedInUser) {
			menuFields.push({
				action: () => {
					navigate(`/user/edit`)
					userDispatch({ type: 'toggleIsUserEditable' })
				},
				id: 'edit-user-button',
				text: getContent('buttonText.editUser')
			})

			menuFields.push({
				action: () => navigate('/conversations'),
				text: 'View Conversations',
				id: 'view-conversations-button'
			})

			menuFields.push({
				action: () => navigate('/privacy'),
				id: 'privacy-policy-button',
				text: 'View Privacy Policy'
			})

			menuFields.push({
				action: () => {
					userDispatch({ type: 'logout' })
					navigate('/discover')
				},
				id: 'logout-button',
				text: getContent('buttonText.logout')
			})
		} else if (loggedInUser) {
			const alreadyFollowed = loggedInUser.friends?.some(({ id }) => workingUser?.id === id)
			if (!alreadyFollowed) {
				menuFields.push({
					action: () => friendUser({ leaderId: workingUser.id, followerId: loggedInUser.id }),
					id: 'follow-user-button',
					text: getContent('buttonText.follow', [workingUser.first_name])
				})
			}
			menuFields.push({
				action: () => navigate('/conversations'),
				id: 'message-user-button',
				text: getContent('buttonText.message', [workingUser.first_name])
			})
		}

		return {
			fields: menuFields
		}
	}

	return buildEditorMenu
}
