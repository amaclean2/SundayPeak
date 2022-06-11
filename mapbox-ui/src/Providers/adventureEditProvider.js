import { useQuery } from '@apollo/client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Lines } from "../SampleData/Lines";
import { GET_ALL_ADVENTURES } from './hooks/typeDefs';

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

	const defaultStartPosition = { lat: 39.347, lng: -120.194, zoom: 10 };

	const { loading, error, data } = useQuery(GET_ALL_ADVENTURES, {
		variables: {
			coordinates: JSON.stringify(defaultStartPosition),
			type: 'line',
			zoom: 10
		}
	});

	useEffect(() => {
		if (data) {
			setAllAdventures(data.getAllAdventures);
		}
	}, [data, loading, error]);

	return (
		<AdventureEditContext.Provider
			value={{
				adventureAddState,
				currentAdventure,
				isEditable,
				allAdventures,
				defaultStartPosition,
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