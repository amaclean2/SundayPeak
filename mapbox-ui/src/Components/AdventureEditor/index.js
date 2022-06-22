import React, { useEffect, useRef, useState } from 'react';

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
		refetchAdventures,
		adventureError
	} = useAdventureEditContext();

	const menuRef = useRef();

	const { saveNewAdventure, startAdventureSaveProcess } = useSaveAdventure();
	const { closeCard } = useCardStateContext();

	const [saveState, setSaveState] = useState(0);

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

	// scrolls back to the top when there is a new error
	useEffect(() => {
		menuRef.current.scrollTop = 0
	}, [adventureError]);

	const saveAdventure = () => {

		if (saveState === 0) {
			console.log("CURRENT_ADVENTURE", currentAdventure);
			startAdventureSaveProcess();
			setSaveState(1);
		} else if (saveState === 1) {
			saveNewAdventure();
			setSaveState(0);
		}
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
			<div className="profile-content" ref={menuRef}>
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
							name="approach_distance"
							label="Approach Distance"
							isEditable={isEditable}
							fullWidth
							options={{ suffix: 'miles' }}
							value={currentAdventure.approach_distance}
							onChange={onChange}
						/>
						<FormField
							name="elevation"
							label="Elevation"
							isEditable={isEditable}
							fullWidth
							options={{ suffix: 'feet' }}
							value={currentAdventure.elevation}
							onChange={onChange}
						/>
						<FormField
							name="season"
							label="Best Season"
							type="selectMany"
							options={{ selectMany: seasonOptions }}
							isEditable={isEditable}
							fullWidth
							value={currentAdventure.season}
							onChange={onChange}
						/>
						<FormField
							name="gear"
							label="Gear Required"
							type="selectMany"
							options={{ selectMany: gearOptions }}
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
							options={{ suffix: 'feet' }}
							onChange={onChange}
						/>
						<FormField
							name="avg_angle"
							label="Average Slope Angle"
							isEditable={isEditable}
							fullWidth
							value={currentAdventure.avg_angle}
							options={{ suffix: 'degrees' }}
							onChange={onChange}
						/>
						<FormField
							name="max_angle"
							label="Max Slope Angle"
							isEditable={isEditable}
							fullWidth
							value={currentAdventure.max_angle}
							options={{ suffix: 'degrees' }}
							onChange={onChange}
						/>
						<FormField
							name="difficulty"
							label="Difficulty"
							type="range"
							options={{ range: rangeValues }}
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
							className="adventure-add-button"
						>
							Add New Adventure
						</Button>
					)}
					{currentAdventure && !isEditable && saveState === 0 && (
						<Button
							onClick={() => setIsEditable(true)}
							className="adventure-edit-button"
						>
							Edit Adventure
						</Button>
					)}
					{currentAdventure && (isEditable || saveState === 1) && (
						<>
							<Button
								onClick={saveAdventure}
								className="adventure-edit-button"
							>
								{(saveState === 0) ? 'Preview Save' : 'Finish Saving'}
							</Button>
							<Button
								onClick={cancelSave}
								className="adventure-edit-button"
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