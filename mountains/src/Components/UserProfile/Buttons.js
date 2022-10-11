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
	const { closeCard } = useCardStateContext()
	const { followUser } = useFollowUser()
	const { handleSaveEditUser } = useEditUser()

	const logout = () => {
		handleLogout().then(() => closeCard())
	}

	const handleFollow = () => followUser({ leaderId: workingUser.id })

	const handleEdit = () => {
		if (isEditable) {
			handleSaveEditUser()
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
						className='button adventure-add-button'
					>
						{isEditable ? 'Save' : 'Edit'}
					</Button>
					{!isEditable && (
						<Button
							id='logout-button'
							onClick={logout}
							className='button adventure-add-button'
						>
							Logout
						</Button>
					)}
				</>
			) : (
				<>
					<Button
						id='follow-user-button'
						onClick={handleFollow}
						className='button adventure-add-button'
					>
						Follow
					</Button>
					<Button
						id='message-user-button'
						onClick={() => {}}
						className='button adventure-add-button'
					>
						Message
					</Button>
				</>
			)}
		</FooterButtons>
	)
}

export default UserProfileButtons
