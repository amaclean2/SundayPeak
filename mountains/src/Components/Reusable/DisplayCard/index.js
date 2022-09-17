import React from 'react';

import { useCardStateContext } from '../../../Providers';
import DisplayHeader from './DisplayHeader';

import './styles.css';

export const DisplayCard = ({ children, onClose = () => { }, configuration = 'left' }) => {
	const { displayCardBoolState, displayCardOpenState } = useCardStateContext();

	if (!displayCardBoolState) {
		return null;
	}

	return (
		<div className={`display-card-container flex-box ${configuration}`}>
			<div className={`display-card ${displayCardOpenState}`}>
				<DisplayHeader onClose={onClose} />
				<div className="display-content">
					{children}
				</div>
			</div>
		</div>
	);
};