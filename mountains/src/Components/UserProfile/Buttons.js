import {
	useCardStateContext,
	useEditUser,
	useFollowUser,
	useUserStateContext
} from '../../Providers'
import { Button, FooterButtons } from '../Reusable'

const UserProfileButtons = () => {
	const { handleLogout, workingUser, loggedInUser, setIsEditable, isEditable } =
		useUserStateContext()
	const { closeCard, setShowAlert, setAlertContent } = useCardStateContext()
	const { followUser } = useFollowUser()
	const { handleSaveEditUser } = useEditUser()

	const logout = () => {
		handleLogout().then(() => closeCard())
	}

	const handleFollow = () => followUser({ leaderId: workingUser.id, followerId: loggedInUser.id })

	const handleEdit = () => {
		if (isEditable) {
			handleSaveEditUser()
			setAlertContent(
				`${workingUser.first_name} ${workingUser.last_name}'s profile has been updated`
			)
			setShowAlert(true)
		}

		setIsEditable(!isEditable)
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
						{isEditable ? 'Save' : 'Edit'}
					</Button>
					{isEditable && (
						<Button
							id='profile-edit-cancel-button'
							onClick={() => setIsEditable(false)}
						>
							Cancel
						</Button>
					)}
					{!isEditable && (
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
