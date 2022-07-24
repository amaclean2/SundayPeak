import React from 'react';

import { useCardStateContext, useUserStateContext } from '../../Providers';
import { Button, DisplayCard, FormField, FooterButtons } from '../Reusable';
import UserProfileButtons from './Buttons';
import Stats from './Stats';

import './styles.css';
import UserTickPanel from './TickPanel';

const GalleryPlaceholder = ({ width }) => (
	<div className="gallery-placeholder" style={{ width }} />
);

const GalleryScroller = () => {
	return (
		<div className="scroller-container">
			<GalleryPlaceholder width={120} />
			<GalleryPlaceholder width={200} />
			<GalleryPlaceholder width={250} />
		</div>
	)
};

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
					<GalleryScroller />
				</div>
				<Stats />
				<UserTickPanel />
				<UserProfileButtons />
			</div>
		</DisplayCard>
	);
};

export default UserProfile;