import React from 'react'

import { useUserStateContext } from '../../Providers'
import { DisplayCard, FieldHeader, HeaderSubtext, ProfileHeader } from '../Reusable'
import UserProfileButtons from './Buttons'

import './styles.css'
import UserViewer from './Viewer'
import UserEditor from './Editor'

const UserProfile = () => {
	const { workingUser, isEditable, setListState } = useUserStateContext()

	if (!workingUser) {
		return null
	}

	const buildProfileHeader = () => {
		if (workingUser) {
			if (isEditable) {
				return (
					<ProfileHeader>
						<FieldHeader
							className='page-header'
							text={`My Profile`}
						/>
					</ProfileHeader>
				)
			} else {
				return (
					<ProfileHeader image={workingUser.profile_picture_url}>
						<FieldHeader
							className='page-header'
							text={`${workingUser.first_name} ${workingUser.last_name}`}
						/>
						<HeaderSubtext>{workingUser.city}</HeaderSubtext>
					</ProfileHeader>
				)
			}
		}
	}

	const handleCloseUser = () => {
		setListState(null)
	}

	return (
		<DisplayCard onClose={handleCloseUser}>
			{buildProfileHeader()}
			<div className='profile-content'>
				<div className='main-user-content'>{isEditable ? <UserEditor /> : <UserViewer />}</div>
				<UserProfileButtons />
			</div>
		</DisplayCard>
	)
}

export default UserProfile
