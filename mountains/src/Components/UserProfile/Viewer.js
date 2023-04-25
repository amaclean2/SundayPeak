import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetUser, useUserStateContext } from '@amaclean2/sundaypeak-treewells'

import { DisplayCard, FlexSpacer } from 'Components/Reusable'
import ActivityPanel from './ActivityPanel'
import UserTodoPanel from './TickPanel'
import { useUserEditorMenu } from './Buttons/utils'
import FriendsViewer from './FriendsViewer'
import UserProfileGallery from './Gallery'
import Stats from './Stats'
import UserBio from './UserBio'

import './styles.css'

const UserViewer = () => {
	const { workingUser, statView, loggedInUser } = useUserStateContext()
	const { userId } = useParams()
	const navigate = useNavigate()
	const buildEditorMenu = useUserEditorMenu()
	const { setWorkingUserToCurrentUser, getNonLoggedInUser } = useGetUser()

	useEffect(() => {
		const numberId = Number(userId)
		if (loggedInUser && numberId === loggedInUser.id) {
			navigate('/user')
		} else if (numberId && numberId !== workingUser?.id) {
			getNonLoggedInUser({ userId: numberId })
		} else if (!numberId && loggedInUser) {
			setWorkingUserToCurrentUser()
		}
	}, [userId, loggedInUser])

	if (!workingUser) return null

	return (
		<DisplayCard
			menu={buildEditorMenu()}
			title={`${workingUser?.first_name} ${workingUser?.last_name}`}
			onClose={() => navigate('/discover')}
		>
			<UserProfileGallery />
			<UserBio />
			<Stats />
			<div className='user-adventure-viewer flex-box'>
				{statView === 'friends' ? (
					<>
						<FriendsViewer />
						<FlexSpacer />
					</>
				) : (
					<>
						{workingUser.todo_adventures?.length > 0 && <UserTodoPanel />}
						{workingUser.completed_adventures?.length > 0 && <ActivityPanel />}
					</>
				)}
			</div>
		</DisplayCard>
	)
}

export default UserViewer
