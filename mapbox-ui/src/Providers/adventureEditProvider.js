import React, { createContext, useContext, useEffect, useState } from 'react';

import { useGetAdventure, useGetAdventures } from './hooks';

const AdventureEditContext = createContext();

export const useAdventureEditContext = () => {
	const context = useContext(AdventureEditContext);

	if (context === undefined) {
		throw new Error('useAdventureEditContext must be used within a AdventureEditProvider');
	}

	return context;
};

export const AdventureEditProvider = ({ children }) => {
	const [allAdventures, setAllAdventures] = useState(null);
	const [adventureAddState, setAdventureAddState] = useState(false);
	const [currentAdventure, setCurrentAdventure] = useState(null);
	const [isEditable, setIsEditable] = useState(false);
	const [adventureError, setAdventureError] = useState(null);

	return (
		<AdventureEditContext.Provider
			value={{
				adventureAddState,
				currentAdventure,
				isEditable,
				allAdventures,
				adventureError,
				setAdventureAddState,
				setCurrentAdventure,
				setIsEditable,
				setAllAdventures,
				setAdventureError
			}}
		>
			{children}
		</AdventureEditContext.Provider>
	)
};