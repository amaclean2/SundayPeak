import React from 'react';
import { Popup } from 'react-map-gl';

import { useCardStateContext, useAdventureEditContext, useTickListContext, CARD_STATES } from '../../../Providers';
import { Button, FormField } from '../../Reusable';

import './styles.css';

const MapPopup = ({ popupInfo, setPopupInfo }) => {
	const { getAdventure } = useAdventureEditContext();
	const { openCard } = useCardStateContext();
	const { addToTickList } = useTickListContext();

	const viewMore = () => {
		return getAdventure({
			variables: {
				id: popupInfo.id
			}
		}).then((resp) => {
			setPopupInfo(null);
			openCard(CARD_STATES.adventures);
		});
	};

	return (
		<Popup
			className="adventure-pop-up"
			anchor="top"
			longitude={Number(popupInfo.coordinates.lng)}
			latitude={Number(popupInfo.coordinates.lat)}
			onClose={() => setPopupInfo(null)}
		>
			<FormField
				value={popupInfo.adventure_name}
				isEditable={false}
				className="card-header"
			/>
			<FormField name="elevation" label="Elevation" isEditable={false} value={popupInfo.elevation} />
			<Button
				small
				id={'view-more-button'}
				className="button popup-view-more-button"
				onClick={viewMore}
			>
				View More
			</Button>
			<Button
				small
				id={'add-to-tick-list-button'}
				className="button popup-add-to-ticklist-button"
				onClick={() => addToTickList(popupInfo.id)}
			>
				Add To Tick List
			</Button>
		</Popup>
	);
};

export default MapPopup;