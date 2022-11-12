import React from 'react'

import { useUserStateContext } from '../../Providers'
import { DisplayCard, FieldHeader, HeaderSubtext, ProfileContent, ProfileHeader } from '../Reusable'
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
			<ProfileContent>
				<div className='main-user-content'>{isEditable ? <UserEditor /> : <UserViewer />}</div>
				<UserProfileButtons />
			</ProfileContent>
		</DisplayCard>
	)
}

export default UserProfile
