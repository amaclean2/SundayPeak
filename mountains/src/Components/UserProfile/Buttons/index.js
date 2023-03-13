import { useCardStateContext, useEditUser, useUserStateContext } from 'Providers'
import getContent from 'TextContent'
import { Button, FooterButtons } from 'Components/Reusable'

const UserProfileButtons = () => {
	const { workingUser, isUserEditable, userDispatch, activeWorkingUser } = useUserStateContext()
	const { cardDispatch } = useCardStateContext()
	const { handleSaveEditUser } = useEditUser()

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

	if (!isUserEditable) {
		return null
	}

	return (
		<FooterButtons>
			{!activeWorkingUser && (
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
