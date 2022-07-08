import React, { useEffect, useRef, useState } from 'react';

import {
	useAdventureEditContext,
	useCardStateContext,
	useGetAdventures,
	useSaveAdventure
} from '../../Providers';
import { Button, DisplayCard, ProfileHeader } from '../Reusable';
import AdventureEditorForm from './Form';

import './styles.css';

const AdventureEditor = () => {
	const {
		adventureAddState,
		setAdventureAddState,
		currentAdventure,
		setCurrentAdventure,
		isEditable,
		setIsEditable,
		adventureError
	} = useAdventureEditContext();

	const { queryAdventures: refetchAdventures } = useGetAdventures();

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

	const saveAdventure = async () => {

		if (saveState === 0) {
			const { error: saveAdventureError } = await startAdventureSaveProcess();

			if (!saveAdventureError) {
				setSaveState(1);
				console.log('READY_ADVENTURE', currentAdventure);
			} else {
				console.error('ADVENTURE_ERROR', saveAdventureError);
			}

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
					<AdventureEditorForm isEditable={isEditable} onChange={onChange} />
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
						<>
							<Button
								onClick={() => setIsEditable(true)}
								className="adventure-edit-button"
								id="adventure-edit-button"
							>
								Edit Adventure
							</Button>
							<Button
								className="adventure-tick-button"
								id="adventure-tick-button"
							>
								Add to Ticklist
							</Button>
						</>
					)}
					{currentAdventure && (isEditable || saveState === 1) && (
						<>
							<Button
								onClick={saveAdventure}
								className="adventure-edit-button"
							>
								{(saveState === 0) ? 'Preview Save' : 'Finish Saving'}
							</Button>
							{saveState === 1 && <Button
								onClick={() => setIsEditable(true)}
								className="adventure-edit-button"
								id="adventure-edit-button"
							>
								Edit Adventure
							</Button>}
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