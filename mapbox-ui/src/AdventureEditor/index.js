import React from 'react';

import DisplayCard from "../DisplayCard";
import { useAdventureEditContext } from "../Providers/adventureEditProvider";
import FormField from "../Reusable/FormField";

import './styles.css';

const AdventureEditor = () => {
	const {
		adventureAddState,
		setAdventureAddState,
		currentAdventure,
		setCurrentAdventure,
		isEditable,
		setIsEditable,
		setAllAdventures
	} = useAdventureEditContext();

	const onChange = (e) => {
		setCurrentAdventure((workingAdventure) => {
			const newAdventure = {...workingAdventure};
			newAdventure.properties[e.target.name] = e.target.value;

			return newAdventure;
		});
	};

	const handleClose = () => {
		setCurrentAdventure(null);
		setAdventureAddState(false);
		setIsEditable(false);
	};

	const saveAdventure = () => {
		setIsEditable(false);
		setAllAdventures((currentAdventures) => {
			const workingAdventureIdx = currentAdventures.findIndex(({ id }) => id === currentAdventure.id);
			const newAdventures = [...currentAdventures];
			newAdventures[workingAdventureIdx].properties = currentAdventure.properties;

			return newAdventures;
		});
	};

	return (
		<DisplayCard onClose={handleClose}>
			<div className="profile-header">
				{
					(currentAdventure) ? (
						<FormField
							value={currentAdventure.properties.name}
							hideLabel
							name="name"
							className="card-header"
							isEditable={isEditable}
							onChange={onChange}
						/>
					) : (
						<FormField
							value={'Adventure Editor'}
							isEditable={false}
							className="card-header"
						/>
					)
				}
			</div>
			<div className="profile-content">
				{currentAdventure && (
					<div className="adventure-info flex-box">
						<FormField
							name="approach"
							label="Approach Distance"
							isEditable={isEditable}
							value={currentAdventure.properties.approach}
							onChange={onChange}
						/>
						<FormField
							name="elevation"
							label="Elevation"
							isEditable={isEditable}
							value={currentAdventure.properties.elevation}
							onChange={onChange}
						/>
						<FormField
							name="season"
							label="Best Season"
							isEditable={isEditable}
							value={currentAdventure.properties.season}
							onChange={onChange}
						/>
						<FormField
							name="gain"
							label="Elevation Gain"
							isEditable={isEditable}
							value={currentAdventure.properties.gain}
							onChange={onChange}
						/>
						<FormField
							name="avgSlope"
							label="Average Sope Angle"
							isEditable={isEditable}
							value={currentAdventure.properties.avgSlope}
							onChange={onChange}
						/>
						<FormField
							name="maxSlope"
							label="Max Slope Angle"
							isEditable={isEditable}
							value={currentAdventure.properties.maxSlope}
							onChange={onChange}
						/>
						<FormField
							name="bio"
							label="Bio"
							isEditable={isEditable}
							value={currentAdventure.properties.bio}
							onChange={onChange}
						/>
					</div>
				)}
				<div className="action-buttons">
					{!currentAdventure && (
						<button
							onClick={() => setAdventureAddState(true)}
							disabled={adventureAddState}
							className="button adventure-add-button"
						>
							Add New Adventure
						</button>
					)}
					{currentAdventure && !isEditable && (
						<button
							onClick={() => setIsEditable(true)}
							className="button adventure-edit-button"
						>
							Edit Adventure
						</button>
					)}
					{currentAdventure && isEditable && (
						<button
							onClick={saveAdventure}
							className="button adventure-edit-button"
						>
							Save
						</button>
					)}
				</div>
			</div>
		</DisplayCard>
	);
};

export default AdventureEditor;