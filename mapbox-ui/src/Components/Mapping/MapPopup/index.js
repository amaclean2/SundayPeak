import React from 'react';
import { Popup } from 'react-map-gl';

import {
	useCardStateContext,
	CARD_STATES,
	useGetAdventure,
	useSaveTick
} from '../../../Providers';
import { Button, FormField } from '../../Reusable';

import './styles.css';

const MapPopup = ({ popupInfo, setPopupInfo }) => {
	const { getAdventure } = useGetAdventure();
	const { openCard } = useCardStateContext();
	const { saveTick } = useSaveTick();

	const viewMore = () => {
		return getAdventure({ id: popupInfo.id }).then(() => {
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
				onClick={() => saveTick({ adventureId: popupInfo.id })}
			>
				Add To Tick List
			</Button>
		</Popup>
	);
};

export default MapPopup;