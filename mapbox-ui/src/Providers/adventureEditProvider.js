import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';

import { GET_ADVENTURE, GET_ALL_ADVENTURES } from './typeDefs';

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

	const defaultStartPosition = { lat: 39.347, lng: -120.194, zoom: 10 };

	const {
		loading: adventureQueryLoading,
		error: adventureQueryError,
		data: adventureQueryData,
		refetch
	} = useQuery(GET_ALL_ADVENTURES, {
		variables: {
			coordinates: JSON.stringify(defaultStartPosition),
			type: 'line',
			zoom: 10
		}
	});

	const [ getAdventure, { data: getAdventureData }] = useLazyQuery(GET_ADVENTURE);

	const refetchAdventures = () => refetch({
		coordinates: JSON.stringify(defaultStartPosition),
		type: 'line',
		zoom: 10
	}).then((response) => {
		setAllAdventures(response.data.getAllAdventures);
	});

	useEffect(() => {
		if (adventureQueryData) {
			setAllAdventures(adventureQueryData.getAllAdventures);
		}
	}, [adventureQueryData, adventureQueryLoading, adventureQueryError]);

	useEffect(() => {
		if (getAdventureData) {
			setCurrentAdventure(getAdventureData.getAdventureDetails);
		}
	}, [getAdventureData]);

	return (
		<AdventureEditContext.Provider
			value={{
				adventureAddState,
				currentAdventure,
				isEditable,
				allAdventures,
				defaultStartPosition,
				adventureError,
				refetchAdventures,
				setAdventureAddState,
				setCurrentAdventure,
				setIsEditable,
				setAllAdventures,
				setAdventureError,
				getAdventure
			}}
		>
			{children}
		</AdventureEditContext.Provider>
	)
};