import React from 'react'
import { useAdventureStateContext } from '../../Providers/AdventureStateProvider'
import { type AdventureType } from '../../Types/Adventures'
import { type EventChoiceTypes } from '../../Hooks/Users'

const AdventureTestConsumer = (): JSX.Element => {
	const {
		allAdventures,
		currentAdventure,
		adventureError,
		startPosition,
		globalAdventureType,
		adventureAddState,
		adventureEditState,
		adventureDispatch
	} = useAdventureStateContext()

	const getAllAdventures = (): void => {
		adventureDispatch({
			type: 'setAllAdventures',
			payload: { type: 'FeatureCollection', features: [] }
		})
	}

	const getCurrentAdventure = (): void => {
		adventureDispatch({
			type: 'setCurrentAdventure',
			payload: {
				adventure_name: 'New Adventure',
				adventure_type: 'ski'
			} as AdventureType
		})
	}

	const setAdventureError = (): void => {
		adventureDispatch({
			type: 'setAdventureError',
			payload: 'New Adventure Error'
		})
	}

	const updateStartPosition = (): void => {
		adventureDispatch({
			type: 'updateStartPosition',
			payload: {
				latitude: 10,
				longitude: 5,
				zoom: 3
			}
		})
	}

	const updateAdventureType = (): void => {
		adventureDispatch({ type: 'setGlobalAdventureType', payload: 'climb' })
	}

	const initialValues = (): void => {
		adventureDispatch({
			type: 'setInitialValues',
			payload: {
				startPosition: {
					latitude: 5.3,
					longitude: 10.2,
					zoom: 12
				},
				globalAdventureType: 'hike'
			}
		})
	}

	const changeAdventure = (event: EventChoiceTypes): void => {
		adventureDispatch({
			type: 'editAdventure',
			payload: event.target
		})
	}

	const startNewAdventure = (): void => {
		adventureDispatch({
			type: 'startNewAdventureProcess',
			payload: 'hike'
		})
	}

	const addNewAdventure = (): void => {
		adventureDispatch({
			type: 'addNewAdventure',
			payload: {
				adventures: {
					type: 'FeatureCollection',
					features: [
						{
							type: 'Feature',
							geometry: {
								type: 'Point',
								coordinates: [5, 10]
							},
							properties: {
								adventure_name: 'My Adventure',
								adventure_type: 'climb',
								id: 2,
								public: true
							}
						}
					]
				},
				currentAdventure: {
					id: 2,
					adventure_name: 'My Adventure',
					adventure_type: 'climb',
					public: true,
					coordinates: {
						lng: 5,
						lat: 10
					}
				} as AdventureType
			}
		})
	}

	const enableDoubleClick = (): void => {
		adventureDispatch({
			type: 'enableMapDoubleClick'
		})
	}

	const closeAdventureView = (): void => {
		adventureDispatch({
			type: 'closeAdventureView'
		})
	}

	const editAdventure = (): void => {
		adventureDispatch({
			type: 'switchIsAdventureEditable'
		})
	}

	return (
		<div>
			<span>Proof of all the adventures: {allAdventures?.type}</span>
			<span>Proof of adventure count: {allAdventures?.features.length}</span>
			<span>Proof of a current adventure: {currentAdventure?.adventure_name}</span>
			<span>Display adventure error: {adventureError}</span>
			<span>Start position view: {startPosition?.zoom}</span>
			<span>Adventure type view: {globalAdventureType}</span>
			<span>Adventure add state view: {adventureAddState.toString()}</span>
			<span>Adventure edit state view: {adventureEditState.toString()}</span>

			<button onClick={getAllAdventures}>Get All Adventures</button>
			<button onClick={getCurrentAdventure}>Get Current Adventure</button>
			<button onClick={setAdventureError}>Set Adventure Error</button>
			<button onClick={updateStartPosition}>Update Start Position</button>
			<button onClick={updateAdventureType}>Update Adventure Type</button>
			<button onClick={initialValues}>Update Initial Values</button>
			<button onClick={startNewAdventure}>Start New Adventure Process</button>
			<button onClick={addNewAdventure}>Add New Adventure</button>
			<button onClick={enableDoubleClick}>Enable Double Click</button>
			<button onClick={closeAdventureView}>Close Adventure View</button>
			<button onClick={editAdventure}>Change Adventure Edit State</button>

			<input
				data-testid={'adventure-edit'}
				type={'text'}
				name={'adventure_name'}
				value={currentAdventure?.adventure_name ?? ''}
				onChange={changeAdventure}
			/>
		</div>
	)
}

export default AdventureTestConsumer
