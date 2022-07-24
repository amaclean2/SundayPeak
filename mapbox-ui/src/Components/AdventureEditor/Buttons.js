import { useState } from "react";

import {
    useAdventureEditContext,
    useCardStateContext,
    useGetAdventures,
    useSaveAdventure
} from "../../Providers";
import { useSaveActivity } from "../../Providers/hooks/GQLCalls/activities";
import { useSaveTick } from "../../Providers/hooks/GQLCalls/ticks";
import { Button, FooterButtons } from "../Reusable";

const AdventureEditorButtons = () => {
    const {
        currentAdventure,
        adventureAddState,
        isEditable,
        setAdventureAddState,
        setIsEditable,
        setCurrentAdventure
    } = useAdventureEditContext();
    const { saveTick } = useSaveTick();
    const { saveActivity } = useSaveActivity();
    const { saveNewAdventure, startAdventureSaveProcess } = useSaveAdventure();
    const { refetchAdventures } = useGetAdventures();
    const { closeCard } = useCardStateContext();

    const [saveState, setSaveState] = useState(0);

    const addTick = async () => saveTick({ adventureId: currentAdventure.id });
    const addActivity = async () => saveActivity({ adventureId: currentAdventure.id });

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
			saveNewAdventure()
				.then(() => {
					refetchAdventures();
					setSaveState(0);
					setCurrentAdventure(null);
				});
		}
	};

    const cancelSave = () => {
		refetchAdventures();
        setIsEditable(false);
        if (!currentAdventure.id) {
            closeCard();
        }
	};

    return (
        <FooterButtons>
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
                        onClick={addTick}
                    >
                        Add to Ticklist
                    </Button>
                    <Button
                        className="adventure-tick-button"
                        id="adventure-tick-button"
                        onClick={addActivity}
                    >
                        Complete Activity
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
        </FooterButtons>
    );
};

export default AdventureEditorButtons;