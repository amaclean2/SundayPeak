import React from 'react';

import { useUserStateContext } from '../../Providers';
import { DisplayCard, FormField } from '../Reusable';
import UserProfileButtons from './Buttons';
import UserProfileGallery from './Gallery';
import UserTickPanel from './TickPanel';
import Stats from './Stats';

import './styles.css';

const UserProfile = () => {
	const { workingUser } = useUserStateContext();

	if (!workingUser) {
		return null;
	}

	return (
		<DisplayCard>
			<div className="profile-header">
				<FormField
					value={`${workingUser.first_name} ${workingUser.last_name}`}
					isEditable={false}
					className="card-header"
				/>
				<div className="profile-photo" />
			</div>
			<div className="profile-content">
				<UserProfileGallery />
				<Stats />
				<UserTickPanel />
				<UserProfileButtons />
			</div>
		</DisplayCard>
	);
};

export default UserProfile;