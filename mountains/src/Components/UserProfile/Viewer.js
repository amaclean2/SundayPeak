import ActivityPanel from './ActivityPanel'
import UserProfileGallery from './Gallery'
import Stats from './Stats'
import UserTickPanel from './TickPanel'
import UserBio from './UserBio'

const UserViewer = () => {
	return (
		<>
			<UserProfileGallery />
			<UserBio />
			<Stats />
			<div className='user-adventure-viewer flex-box'>
				<UserTickPanel />
				<ActivityPanel />
			</div>
		</>
	)
}

export default UserViewer
