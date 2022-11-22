import {
	useCardStateContext,
	useEditUser,
	useFollowUser,
	useUserStateContext
} from '../../../Providers'
import getContent from '../../../TextContent'
import { Button, FooterButtons } from '../../Reusable'

const UserProfileButtons = () => {
	const { workingUser, loggedInUser, isUserEditable, userDispatch } = useUserStateContext()
	const { cardDispatch } = useCardStateContext()
	const { followUser } = useFollowUser()
	const { handleSaveEditUser } = useEditUser()

	const logout = () => {
		userDispatch({ type: 'logout' }).then(() => cardDispatch({ type: 'closeCard' }))
	}

	const handleFollow = () => followUser({ leaderId: workingUser.id, followerId: loggedInUser.id })

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

	return (
		<FooterButtons>
			{workingUser.id === loggedInUser.id && (
				<>
					{isUserEditable && (
						<Button
							id='edit-user-button'
							onClick={handleEdit}
							className='adventure-add-button'
						>
							{getContent('buttonText.saveUser')}
						</Button>
					)}
					{isUserEditable && (
						<Button
							id='profile-edit-cancel-button'
							onClick={() => userDispatch({ type: 'toggleIsUserEditable' })}
						>
							Cancel
						</Button>
					)}
				</>
			)}
		</FooterButtons>
	)
}

export default UserProfileButtons
