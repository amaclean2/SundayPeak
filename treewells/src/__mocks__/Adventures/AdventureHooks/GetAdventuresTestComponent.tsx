import React from 'react'
import { Connections } from '../../../config'
import { SundayPeakProviders } from '../../../Providers'
import { useAdventureStateContext } from '../../../Providers/AdventureStateProvider'
import { useGetAdventures } from '../../../Hooks/Adventures'

Connections.setConnections(
	{ restUrl: 'http://api.sundaypeak.com', websocketUrl: 'ws://api.sundaypeak.com:4000' },
	localStorage
)

const GetAdventuresTestComponent = (): JSX.Element => {
	const { allAdventures } = useAdventureStateContext()
	const { getAllAdventures, changeAdventureType } = useGetAdventures()

	return (
		<div>
			<button
				onClick={() => {
					getAllAdventures({ type: 'climb' })
				}}
			>
				Get All Adventures
			</button>
			<button
				onClick={() => {
					changeAdventureType({ type: 'hike' })
				}}
			>
				Change Adventure Type
			</button>
			<span>Proof of adventures: {allAdventures?.type}</span>
			<span>Adventure count: {allAdventures?.features.length}</span>
		</div>
	)
}

const GetAdventuresTestWrapper = (): JSX.Element => {
	return (
		<SundayPeakProviders>
			<GetAdventuresTestComponent />
		</SundayPeakProviders>
	)
}

export default GetAdventuresTestWrapper
