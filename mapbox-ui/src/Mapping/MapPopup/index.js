import { Popup } from 'react-map-gl';
import { useCardStateContext } from '../../Providers/cardStateProvider';
import { useLineEditContext } from '../../Providers/lineEditProvider';
import { useTickListContext } from '../../Providers/tickListProvider';
import FormField from '../../Reusable/FormField';

import './styles.css';

const MapPopup = ({ popupInfo, setPopupInfo }) => {
	const {setCurrentLine} = useLineEditContext();
	const {openCard} = useCardStateContext();
	const {addToTickList} = useTickListContext();

	const viewMore = () => {
		setCurrentLine(popupInfo);
		setPopupInfo(null);
		openCard('lines');
	};

	return (
		<Popup
			className="line-pop-up"
			anchor="top"
			longitude={Number(popupInfo.geometry.coordinates[0])}
			latitude={Number(popupInfo.geometry.coordinates[1])}
			onClose={() => setPopupInfo(null)}
		>
			<FormField
				value={popupInfo.properties.name}
				isEditable={false}
				className="card-header"
			/>
			<FormField name="elevation" label="Elevation" isEditable={false} value={popupInfo.properties.elevation} />
			<button
				className="button popup-view-more-button"
				onClick={viewMore}
			>
				View More
			</button>
			<button
				className="button popup-add-to-ticklist-button"
				onClick={() => addToTickList(popupInfo.id)}
			>
				Add To Tick List
			</button>
		</Popup>
	);
};

export default MapPopup;