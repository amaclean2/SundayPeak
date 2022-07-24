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
	const [mapboxToken, setMapboxToken] = useState(null);

	return (
		<AdventureEditContext.Provider
			value={{
				adventureAddState,
				currentAdventure,
				isEditable,
				allAdventures,
				adventureError,
				mapboxToken,
				setAdventureAddState,
				setCurrentAdventure,
				setIsEditable,
				setAllAdventures,
				setAdventureError,
				setMapboxToken
			}}
		>
			{children}
		</AdventureEditContext.Provider>
	)
};