import React from 'react'
import { Button, ErrorField, FormField } from 'Components/Reusable'
import {
	useSaveAdventure,
	useSaveZones,
	useZoneStateContext
} from '@amaclean2/sundaypeak-treewells'
import { useNavigate } from 'react-router-dom'

const ZoneFields = () => {
	const { currentZone } = useZoneStateContext()
	const { editZone } = useSaveZones()
	const { toggleAdventureAddState } = useSaveAdventure()
	const navigate = useNavigate()

	return (
		<>
			<div className={'flex-box adventure-button-header'}>
				<Button
					key={`move_marker_button`}
					small
					onClick={() => toggleAdventureAddState('zone')}
					id={'move-zone-marker'}
				>
					Move Marker
				</Button>
				<Button
					key={`add_adventure_button`}
					small
					onClick={() => navigate(`/zone/edit/${currentZone.id}/adventureFinder`)}
					id={'add-adventure-button'}
				>
					Add Adventure
				</Button>
				<Button
					key={`add_zone_button`}
					small
					onClick={() => navigate(`/zone/edit/${currentZone.id}/zoneFinder`)}
					id={'add-zone-button'}
				>
					Add Area
				</Button>
			</div>
			<ErrorField form={'zone'} />
			<FormField
				name='zone_name'
				label={'Area Name'}
				isEditable
				isLargeField
				fullWidth
				value={currentZone?.zone_name || ''}
				autoFocus={true}
				onChange={editZone}
			/>
			<FormField
				name='bio'
				label={'Description'}
				type='textarea'
				isEditable
				fullWidth
				value={currentZone?.bio || ''}
				onChange={editZone}
			/>
			<FormField
				name='approach'
				label={'Approach'}
				type='textarea'
				isEditable
				fullWidth
				value={currentZone?.approach || ''}
				onChange={editZone}
			/>
			<FormField
				name='nearest_city'
				label={'Nearest City'}
				isEditable
				fullWidth
				value={currentZone?.nearest_city || ''}
				onChange={editZone}
			/>
		</>
	)
}

export default ZoneFields
