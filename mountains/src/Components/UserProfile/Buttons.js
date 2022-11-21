import {
	useCardStateContext,
	useEditUser,
	useFollowUser,
	useUserStateContext
} from '../../Providers'
import { Button, FooterButtons } from '../Reusable'

const UserProfileButtons = () => {
	const { workingUser, loggedInUser, isUserEditable, userDispatch } = useUserStateContext()
	const { cardDispatch } = useCardStateContext()
	const { followUser } = useFollowUser()
	const { handleSaveEditUser } = useEditUser()

	const logout = () => {
		userDispatch({ type: 'logout' })
		cardDispatch({ type: 'closeCard' })
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
			{workingUser.id === loggedInUser.id ? (
				<>
					<Button
						id='edit-user-button'
						onClick={handleEdit}
						className='adventure-add-button'
					>
						{isUserEditable ? 'Save' : 'Edit'}
					</Button>
					{isUserEditable && (
						<Button
							id='profile-edit-cancel-button'
							onClick={() => userDispatch({ type: 'toggleIsUserEditable' })}
						>
							Cancel
						</Button>
					)}
					{!isUserEditable && (
						<Button
							id='logout-button'
							onClick={logout}
							className='adventure-add-button'
						>
							Logout
						</Button>
					)}
				</>
			) : (
				<>
					{
						<Button
							id='follow-user-button'
							onClick={handleFollow}
							className='adventure-add-button'
						>
							Follow
						</Button>
					}
					<Button
						id='message-user-button'
						onClick={() => {}}
						className='adventure-add-button'
					>
						Message
					</Button>
				</>
			)}
		</FooterButtons>
	)
}

export default UserProfileButtons
