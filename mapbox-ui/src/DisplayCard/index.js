import CarretIcon from '../Images/CarretIcon';
import { useCardStateContext } from '../Providers/cardStateProvider';

import './styles.css';

const DisplayCard = ({ children }) => {
	const { displayCardBoolState, displayCardOpenState, closeCard } = useCardStateContext();

	if (!displayCardBoolState) {
		return null;
	}

	return (
		<div className={`display-card ${displayCardOpenState}`}>
			<div className="display-header">
				<div className="display-header-spacer" />
				<button className="display-back-button flex-box" onClick={closeCard}>
					<CarretIcon />
				</button>
			</div>
			<div className="display-content">
				{children}
			</div>
		</div>
	)
};

export default DisplayCard;