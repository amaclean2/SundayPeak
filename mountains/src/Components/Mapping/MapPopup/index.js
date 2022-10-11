import React from 'react'
import { Popup } from 'react-map-gl'

import { useSaveTick } from '../../../Providers'
import { Button, FieldHeader, FieldRow, FooterButtons } from '../../Reusable'
import { DescriptionField, PopupField } from './PopupField'
import { formatSeasons } from '../../AdventureEditor/utils'

import './styles.css'

const MapPopup = ({ viewMore, popupInfo, setPopupInfo }) => {
	const { saveTick } = useSaveTick()
	const seasonArray =
		typeof popupInfo.season === 'string' ? JSON.parse(popupInfo.season) : popupInfo.season

	if (!popupInfo) return

	return (
		<Popup
			className='adventure-pop-up'
			anchor='top'
			longitude={Number(popupInfo.coordinates.lng)}
			latitude={Number(popupInfo.coordinates.lat)}
			onClose={() => setPopupInfo(null)}
		>
			<FieldHeader text={popupInfo.adventure_name} />
			<section className='popup-info'>
				<DescriptionField>{popupInfo.bio}</DescriptionField>
				<FieldRow>
					<PopupField
						name='Elevation'
						value={popupInfo.elevation}
						className='elevation'
					/>
					<PopupField
						name='Difficulty'
						value={popupInfo.difficulty}
						className='difficulty'
					/>
				</FieldRow>
				<PopupField
					name='Seasons'
					value={formatSeasons({ seasonArray })}
				/>
			</section>
			<FooterButtons className='popup-buttons'>
				<Button
					small
					id={'view-more-button'}
					className='button popup-view-more-button'
					onClick={viewMore}
				>
					View More
				</Button>
				<Button
					small
					id={'add-to-tick-list-button'}
					className='button popup-add-to-ticklist-button'
					onClick={() => saveTick({ adventureId: popupInfo.id })}
				>
					Add To Tick List
				</Button>
			</FooterButtons>
		</Popup>
	)
}

export default MapPopup
