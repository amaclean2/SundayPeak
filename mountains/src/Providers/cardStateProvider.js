import React, { createContext, useContext, useEffect, useState } from 'react';

const CardStateContext = createContext();

export const useCardStateContext = () => {
	const context = useContext(CardStateContext);

	if (context === undefined) {
		throw new Error('useCardStateContext must be used within a CardStateProvider');
	}

	return context;
};

const changeCardState = (cardState) => {

	switch (cardState) {
		case 'open':
			return 'closing';
		case 'closing':
			return 'closed';
		case 'closed':
			return 'opening';
		case 'opening':
			return 'open';
		default:
			return 'closed';
	}
};

export const CARD_STATES = {
	adventures: 'adenvetures',
	profile: 'profile',
	signup: 'signup',
	login: 'login'
};

export const CardStateProvider = ({ children }) => {
	const [displayCardOpenState, setDisplayCardOpenState] = useState('closed');
	const [displayCardBoolState, setDisplayCardBoolState] = useState(false);
	const [workingCard, setWorkingCard] = useState('');
	const [viewingImage, setViewingImage] = useState(null);

	const openCard = async (newWorkingCard) => {
		setDisplayCardOpenState(changeCardState('closed'));
		setWorkingCard(newWorkingCard);

		return setTimeout(() => {
			setDisplayCardOpenState(changeCardState('opening'));
		}, 50);
	};

	const switchCard = async (newWorkingCard) => {
		setWorkingCard(newWorkingCard);
	};

	const closeCard = async () => {
		setDisplayCardOpenState(changeCardState('open'));

		return setTimeout(() => {
			setDisplayCardOpenState(changeCardState('closing'));
			setWorkingCard('');
		}, 300);
	};

	useEffect(() => {
		if (['opening', 'open', 'closing'].includes(displayCardOpenState)) {
			setDisplayCardBoolState(true);
		} else {
			setDisplayCardBoolState(false);
		}
	}, [displayCardOpenState]);

	return (
		<CardStateContext.Provider
			value={{
				displayCardOpenState,
				displayCardBoolState,
				workingCard,
				viewingImage,
				// notFullyOpen describes the intermediate loading states of animations
				notFullyOpen: ['closing', 'closed', 'opening'].includes(displayCardOpenState),
				setDisplayCardOpenState,
				openCard,
				closeCard,
				switchCard,
				setViewingImage
			}}
		>
			{children}
		</CardStateContext.Provider>
	)
};