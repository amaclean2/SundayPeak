import React from 'react';

import { CarretIcon } from '../../../Images';
import { useCardStateContext } from '../../../Providers';

import './styles.css';

export const DisplayCard = ({ children, onClose = () => { }, configuration = 'left' }) => {
	const { displayCardBoolState, displayCardOpenState, closeCard } = useCardStateContext();

	if (!displayCardBoolState) {
		return null;
	}

	const localOnClose = (e) => {
		onClose(e);
		closeCard();
	}

	return (
		<div className={`display-card-container flex-box ${configuration}`}>
			<div className={`display-card ${displayCardOpenState}`}>
				<div className="display-header">
					<div className="display-header-spacer" />
					<button className="display-back-button flex-box" onClick={localOnClose}>
						<CarretIcon />
					</button>
				</div>
				<div className="display-content">
					{children}
				</div>
			</div>
		</div>
	);
};