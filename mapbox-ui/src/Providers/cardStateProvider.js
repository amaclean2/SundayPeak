import { createContext, useContext, useEffect, useState } from "react";

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

export const CardStateProvider = ({ children }) => {
	const [displayCardOpenState, setDisplayCardOpenState] = useState('open');
	const [displayCardBoolState, setDisplayCardBoolState] = useState(true);

	const openCard = () => {
		setDisplayCardOpenState(changeCardState('closed'));

		setTimeout(() => {
			setDisplayCardOpenState(changeCardState('opening'));
		}, 50);
	};

	const closeCard = () => {
		setDisplayCardOpenState(changeCardState('open'));

		setTimeout(() => {
			setDisplayCardOpenState(changeCardState('closing'));
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
				notFullyOpen: ['closing', 'closed', 'opening'].includes(displayCardOpenState),
				setDisplayCardOpenState,
				openCard,
				closeCard,
			}}
		>
			{children}
		</CardStateContext.Provider>
	)
};