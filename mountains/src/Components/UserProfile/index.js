import React, { useEffect } from 'react'

import { useFollowUser, useUserStateContext } from 'Providers'
import {
	DisplayCard,
	FieldHeader,
	FlexSpacer,
	HeaderSubtext,
	ProfileContent,
	ProfileHeader
} from 'Components/Reusable'
import UserProfileButtons from './Buttons'

import './styles.css'
import UserViewer from './Viewer'
import UserEditor from './Editor'
import UserEditorMenu from './Buttons/MenuFields'

const UserProfile = () => {
	const { workingUser, isUserEditable, userDispatch } = useUserStateContext()
	const { getFriends } = useFollowUser()

	useEffect(() => {
		getFriends({ userId: workingUser.id })
	}, [workingUser.id])

	if (!workingUser) {
		return null
	}

	const buildProfileHeader = () => {
		if (workingUser) {
			return isUserEditable ? (
				<ProfileHeader
					className={'edit-user-profile-header'}
					slim
				>
					<FieldHeader className='page-header'>My Profile</FieldHeader>
				</ProfileHeader>
			) : (
				<ProfileHeader
					locked
					image={workingUser.profile_picture_url}
					className={'user-profile-header'}
				>
					<div>
						<FieldHeader
							className='page-header'
							text={`${workingUser.first_name} ${workingUser.last_name}`}
						/>
						{workingUser.city?.length && <HeaderSubtext>{workingUser.city}</HeaderSubtext>}
					</div>
					<FlexSpacer />
					<UserEditorMenu />
				</ProfileHeader>
			)
		}
	}

	return (
		<DisplayCard onClose={() => userDispatch({ type: 'closeUser' })}>
			{buildProfileHeader()}
			<ProfileContent>
				<div className='main-user-content'>{isUserEditable ? <UserEditor /> : <UserViewer />}</div>
				<UserProfileButtons />
			</ProfileContent>
		</DisplayCard>
	)
}

export default UserProfile
