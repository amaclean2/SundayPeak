import React, { createContext, useContext, useState } from 'react';
import { Lines } from "../SampleData/Lines";

const AdventureEditContext = createContext();

export const useAdventureEditContext = () => {
	const context = useContext(AdventureEditContext);

	if (context === undefined) {
		throw new Error('useAdventureEditContext must be used within a AdventureEditProvider');
	}

	return context;
};

export const AdventureEditProvider = ({ children }) => {
	const [allAdventures, setAllAdventures] = useState(Lines);
	const [adventureAddState, setAdventureAddState] = useState(false);
	const [currentAdventure, setCurrentAdventure] = useState(null);
	const [isEditable, setIsEditable] = useState(false);

	return (
		<AdventureEditContext.Provider
			value={{
				adventureAddState,
				currentAdventure,
				isEditable,
				allAdventures,
				setAdventureAddState,
				setCurrentAdventure,
				setIsEditable,
				setAllAdventures
			}}
		>
			{children}
		</AdventureEditContext.Provider>
	)
};