import { useAdventureStateContext } from '@amaclean2/sundaypeak-treewells'
import React, { useMemo } from 'react'
import { Chart } from 'react-charts'

import './styles.css'

const ElevationView = () => {
	const { currentAdventure } = useAdventureStateContext()

	const elevations = currentAdventure.elevations.map((point) => ({
		distance: point[1],
		elevation: point[0]
	}))

	const primaryAxis = useMemo(() => ({
		getValue: (datum) => datum.distance
	}))

	const secondaryAxes = useMemo(() => [
		{
			getValue: (datum) => datum.elevation
		}
	])

	console.log({ elevations: currentAdventure.elevations })

	return (
		<div className='chart-container'>
			<Chart
				options={{
					data: [{ label: 'elevation', data: elevations }],
					primaryAxis,
					secondaryAxes,
					secondaryCursor: false
				}}
			/>
		</div>
	)
}

export default ElevationView
