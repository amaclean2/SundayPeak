import React from 'react';

import DisplayCard from "../DisplayCard";
import { useCardStateContext } from "../Providers/cardStateProvider";
import { useTickListContext } from "../Providers/tickListProvider";
import { useUserStateContext } from "../Providers/userStateProvider";
import FormField from "../Reusable/FormField";
import './styles.css';

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

const StatTemplate = ({ statLabel = '', statValue = '', statName = '' }) => (
	<FormField
		name={statName}
		label={statLabel}
		isEditable={false}
		value={statValue}
		className="stat-field"
		onChange={() => { }}
	/>
);

const Location = ({ value = '' }) => (
	<FormField
		name="city"
		label="Location"
		isEditable={false}
		value={value}
		className="location-field"
		onChange={() => { }}
	/>
);

const Tick = ({ tickName }) => (
	<span className="tick">{tickName}</span>
);

const TickList = () => {
	const { allTicks } = useTickListContext();

	return (
		<div className="tick-list flex-box">
			<Tick tickName={"Matterhorn, East Buttress"} />
			<Tick tickName={"Mt Tallac"} />
			<Tick tickName={"Mt Tom"} />
			<Tick tickName={"The Patriarch"} />
			<Tick tickName={"Mt Shasta"} />
		</div>
	);
};

const UserProfile = () => {
	const { handleLogout, workingUser } = useUserStateContext();
	const { closeCard } = useCardStateContext();

	const logout = () => {
		handleLogout().then((resp) => {
			console.log(resp);
			closeCard();
		});
	};

	const editUser = () => {

	};

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
				<div className="stats flex-box">
					<StatTemplate statLabel={"Activities"} statValue={35} />
					<StatTemplate statLabel={"Followers"} statValue={23} />
					<StatTemplate statLabel={"Following"} statValue={16} />
					<div className="flex-spacer" />
					<Location value={workingUser.city} />
				</div>
				<div className="tick-list-container">
					<h3 className="tick-list-header">Tick List</h3>
					<TickList />
				</div>
				<div className="action-buttons">
					<button
						onClick={logout}
						className="button adventure-add-button"
					>
						Logout
					</button>
					<button
						onClick={editUser}
						className="button adventure-add-button"
					>
						Edit
					</button>
				</div>
			</div>
		</DisplayCard>
	);
};

export default UserProfile;