import React, { useEffect } from 'react';

import { useAdventureEditContext, useCardStateContext } from '../../Providers';
import { Button, DisplayCard, ErrorField, FormField, ProfileHeader } from '../Reusable';
import { useSaveAdventure } from './hooks';
import { gearOptions, rangeValues, seasonOptions } from './utils';

import './styles.css';

const AdventureEditor = () => {
	const {
		adventureAddState,
		setAdventureAddState,
		currentAdventure,
		setCurrentAdventure,
		isEditable,
		setIsEditable,
		refetchAdventures
	} = useAdventureEditContext();

	const { saveNewAdventure, newAdventureData } = useSaveAdventure();

	const { closeCard } = useCardStateContext();

	console.log("CURRENT_ADVENTURE", currentAdventure);

	const onChange = (e) => {
		
		setCurrentAdventure((workingAdventure) => {
			const newAdventure = { ...workingAdventure };
			newAdventure[e.target.name] = e.target.value;

			return newAdventure;
		});
	};

	const handleClose = () => {
		setCurrentAdventure(null);
		setAdventureAddState(false);
		setIsEditable(false);
	};

	const saveAdventure = () => {
		// setIsEditable(false);
		saveNewAdventure();
	};

	const cancelSave = () => {
		refetchAdventures();
		closeCard();
	};

	return (
		<DisplayCard onClose={handleClose}>
			{currentAdventure && (
				<ProfileHeader
					textContents={currentAdventure.adventure_name}
					editFields={{
						isEditable: isEditable,
						propName: 'adventure_name',
						onChange
					}}
				/>
			)}
			<div className="profile-content">
				{currentAdventure && (
					<div className="adventure-info flex-box">
						<ErrorField form={'adventure'} />
						<FormField
							name="bio"
							label="Bio"
							type="textarea"
							isEditable={isEditable}
							fullWidth
							value={currentAdventure.bio}
							onChange={onChange}
						/>
						<FormField
							name="approach"
							label="Approach Distance"
							isEditable={isEditable}
							fullWidth
							value={currentAdventure.approach}
							onChange={onChange}
						/>
						<FormField
							name="elevation"
							label="Elevation"
							isEditable={isEditable}
							fullWidth
							value={currentAdventure.elevation}
							onChange={onChange}
						/>
						<FormField
							name="season"
							label="Best Season"
							type="selectMany"
							selectMany={{ options: seasonOptions}}
							isEditable={isEditable}
							fullWidth
							value={currentAdventure.season}
							onChange={onChange}
						/>
						<FormField
							name="gear"
							label="Gear Required"
							type="selectMany"
							selectMany={{ options: gearOptions }}
							isEditable={isEditable}
							fullWidth
							value={currentAdventure.gear}
							onChange={onChange}
						/>
						<FormField
							name="gain"
							label="Elevation Gain"
							isEditable={isEditable}
							fullWidth
							value={currentAdventure.gain}
							onChange={onChange}
						/>
						<FormField
							name="avgSlope"
							label="Average Slope Angle"
							isEditable={isEditable}
							fullWidth
							value={currentAdventure.avgSlope}
							onChange={onChange}
						/>
						<FormField
							name="maxSlope"
							label="Max Slope Angle"
							isEditable={isEditable}
							fullWidth
							value={currentAdventure.maxSlope}
							onChange={onChange}
						/>
						<FormField
							name="difficulty"
							label="Difficulty"
							type="range"
							range={rangeValues}
							isEditable={isEditable}
							fullWidth
							value={currentAdventure.difficulty}
							onChange={onChange}
						/>
						<FormField
							name="nearest_city"
							label="Nearest City"
							isEditable={isEditable}
							fullWidth
							value={currentAdventure.nearest_city}
							onChange={onChange}
						/>
					</div>
				)}
				<div className="action-buttons">
					{!currentAdventure && (
						<Button
							onClick={() => setAdventureAddState(true)}
							disabled={adventureAddState}
							className="button adventure-add-button"
						>
							Add New Adventure
						</Button>
					)}
					{currentAdventure && !isEditable && (
						<Button
							onClick={() => setIsEditable(true)}
							className="button adventure-edit-button"
						>
							Edit Adventure
						</Button>
					)}
					{currentAdventure && isEditable && (
						<>
							<Button
								onClick={saveAdventure}
								className="button adventure-edit-button"
							>
								Save
							</Button>
							<Button
								onClick={cancelSave}
								className="button adventure-edit-button"
							>
								Cancel
							</Button>
						</>
					)}
				</div>
			</div>
		</DisplayCard>
	);
};

export default AdventureEditor;