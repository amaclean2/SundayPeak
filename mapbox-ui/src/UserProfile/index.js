import DisplayCard from "../DisplayCard";
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

const StatTemplate = ({ statLabel = '', statValue = '' }) => (
	<div className="stat-container flex-box">
		<span className="stat-label">{statLabel}</span>
		<span className="stat-value">{statValue}</span>
	</div>
);

const Location = ({ value = '' }) => (
	<div className="stat-container flex-box location-container">
		<span className="stat-label">Location</span>
		<span className="location-value">{value}</span>
	</div> 
);

const Tick = ({ tickName }) => (
	<span className="tick">{tickName}</span>
);

const TickList = () => (
	<div className="tick-list flex-box">
		<Tick tickName={"Matterhorn, East Buttress"} />
		<Tick tickName={"Mt Tallac"} />
		<Tick tickName={"Mt Tom"} />
		<Tick tickName={"The Patriarch"} />
		<Tick tickName={"Mt Shasta"} />
	</div>
);

const UserProfile = () => {
	return (
		<DisplayCard>
			<div className="profile-header">
				<h1>Andrew Maclean</h1>
				<div className="profile-photo" />
			</div>
			<div className="gallery-box">
				<GalleryScroller />
			</div>
			<div className="stats flex-box">
				<StatTemplate statLabel={"Activities"} statValue={35} />
				<StatTemplate statLabel={"Followers"} statValue={23} />
				<StatTemplate statLabel={"Following"} statValue={16} />
				<div className="flex-spacer" />
				<Location value="Truckee, California" />
			</div>
			<div className="tick-list-container">
				<h3 className="tick-list-header">Tick List</h3>
				<TickList />
			</div>
		</DisplayCard>
	);
};

export default UserProfile;