import React from 'react';

import { useCardStateContext, useUserStateContext } from '../../Providers';
import { Button, DisplayCard, FormField, FooterButtons } from '../Reusable';
import UserProfileButtons from './Buttons';
import UserProfileGallery from './Gallery';
import UserTickPanel from './TickPanel';
import Stats from './Stats';

import './styles.css';

const UserProfile = () => {
	const { workingUser } = useUserStateContext();

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
				<div className="gallery-box">
					<UserProfileGallery />
				</div>
				<Stats />
				<UserTickPanel />
				<UserProfileButtons />
			</div>
		</DisplayCard>
	);
};

export default UserProfile;