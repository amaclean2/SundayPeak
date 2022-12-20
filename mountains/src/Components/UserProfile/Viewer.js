import { FlexSpacer } from 'Components/Reusable'
import { useUserStateContext } from '../../Providers'
import ActivityPanel from './ActivityPanel'
import FriendsViewer from './FriendsViewer'
import UserProfileGallery from './Gallery'
import Stats from './Stats'
import UserTickPanel from './TickPanel'
import UserBio from './UserBio'

const ListViewer = () => {
	const { listState } = useUserStateContext()

	if (listState === 'friends') {
		return (
			<>
				<FriendsViewer />
				<FlexSpacer />
			</>
		)
	} else {
		return (
			<>
				<UserTickPanel />
				<ActivityPanel />
			</>
		)
	}
}

const UserViewer = () => {
	return (
		<>
			<UserProfileGallery />
			<UserBio />
			<Stats />
			<div className='user-adventure-viewer flex-box'>
				<ListViewer />
			</div>
		</>
	)
}

export default UserViewer
