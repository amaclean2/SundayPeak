import cx from 'classnames'
import { useAdventureStateContext, useGetAdventures } from '@amaclean2/sundaypeak-treewells'

import { Button } from 'Components/Reusable'
import { LargeActivityIcon } from 'Images'

const MainAdventureSelector = () => {
	const { globalAdventureType } = useAdventureStateContext()
	const { changeAdventureType } = useGetAdventures()

	const svgSize = 30

	return (
		<div className='adventure-pill-selector full-width flex-box'>
			<Button
				id='set-ski-adventure-type'
				className={cx(globalAdventureType === 'ski' && 'current-adventure-type')}
				onClick={() => changeAdventureType({ type: 'ski' })}
			>
				<LargeActivityIcon
					size={svgSize}
					color={globalAdventureType === 'ski' ? '#FFF' : '#000'}
					type={'ski'}
				/>
				Ski
			</Button>
			<Button
				id='set-bike-adventure-type'
				className={cx(globalAdventureType === 'bike' && 'current-adventure-type')}
				onClick={() => changeAdventureType({ type: 'bike' })}
			>
				<LargeActivityIcon
					size={svgSize}
					color={globalAdventureType === 'bike' ? '#FFF' : '#000'}
					type={'bike'}
				/>
				Ride
			</Button>
			<Button
				id='set-climb-adventure-type'
				className={cx(globalAdventureType === 'climb' && 'current-adventure-type')}
				onClick={() => changeAdventureType({ type: 'climb' })}
			>
				<LargeActivityIcon
					size={svgSize}
					color={globalAdventureType === 'climb' ? '#FFF' : '#000'}
					type={'climb'}
				/>
				Climb
			</Button>
			<Button
				id='set-hike-adventure-type'
				className={cx(globalAdventureType === 'hike' && 'current-adventure-type')}
				onClick={() => changeAdventureType({ type: 'hike' })}
			>
				<LargeActivityIcon
					size={svgSize}
					color={globalAdventureType === 'hike' ? '#FFF' : '#000'}
					type={'hike'}
				/>
				Hike
			</Button>
		</div>
	)
}

export default MainAdventureSelector
