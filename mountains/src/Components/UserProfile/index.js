import React from 'react'

import { useUserStateContext } from '../../Providers'
import {
	DisplayCard,
	FieldHeader,
	FlexSpacer,
	HeaderSubtext,
	ProfileContent,
	ProfileHeader
} from '../Reusable'
import UserProfileButtons from './Buttons'

import './styles.css'
import UserViewer from './Viewer'
import UserEditor from './Editor'
import UserEditorMenu from './Buttons/MenuFields'

const UserProfile = () => {
	const { workingUser, isUserEditable, userDispatch } = useUserStateContext()

	if (!workingUser) {
		return null
	}

	const buildProfileHeader = () => {
		if (workingUser) {
			if (isUserEditable) {
				return (
					<ProfileHeader>
						<FieldHeader className='page-header'>My Profile</FieldHeader>
					</ProfileHeader>
				)
			} else {
				return (
					<ProfileHeader
						image={workingUser.profile_picture_url}
						className={'user-profile-header'}
					>
						<div>
							<FieldHeader
								className='page-header'
								text={`${workingUser.first_name} ${workingUser.last_name}`}
							/>
							<HeaderSubtext>{workingUser.city}</HeaderSubtext>
						</div>
						<FlexSpacer />
						<UserEditorMenu />
					</ProfileHeader>
				)
			}
		}
	}

	const handleCloseUser = () => {
		userDispatch({ type: 'resetListState' })
	}

	return (
		<DisplayCard onClose={handleCloseUser}>
			{buildProfileHeader()}
			<ProfileContent>
				<div className='main-user-content'>{isUserEditable ? <UserEditor /> : <UserViewer />}</div>
				<UserProfileButtons />
			</ProfileContent>
		</DisplayCard>
	)
}

export default UserProfile
