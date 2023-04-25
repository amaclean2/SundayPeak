import {
	useEditUser,
	useUserStateContext,
	useManipulateFlows
} from '@amaclean2/sundaypeak-treewells'

import getContent from 'TextContent'
import { Button, FooterButtons } from 'Components/Reusable'

const UserProfileButtons = () => {
	const { workingUser, isUserEditable, activeWorkingUser } = useUserStateContext()
	const { openAlert } = useManipulateFlows()
	const { handleSaveEditUser, toggleUserEditState } = useEditUser()

	const handleEdit = () => {
		if (isUserEditable) {
			handleSaveEditUser()
			openAlert(`${workingUser.first_name} ${workingUser.last_name}'s profile has been updated`)
		}
		toggleUserEditState()
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
							onClick={toggleUserEditState}
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
