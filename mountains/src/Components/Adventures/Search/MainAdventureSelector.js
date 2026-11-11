import cx from 'classnames'
import { useAdventureStateContext, useGetAdventures } from 'State'

import { Button } from 'Components/Reusable'
import { LargeActivityIcon } from 'Images'

const MainAdventureSelector = () => {
	const { globalAdventureType } = useAdventureStateContext()
	const { changeAdventureType } = useGetAdventures()

	const svgSize = 20

	return (
		<div className='adventure-pill-selector flex-box'>
			<Button
				id='set-ski-adventure-type'
				className={cx(
					'adventure-pill-button',
					globalAdventureType === 'ski' && 'current-adventure-type'
				)}
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
				className={cx(
					'adventure-pill-button',
					globalAdventureType === 'bike' && 'current-adventure-type'
				)}
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
				className={cx(
					'adventure-pill-button',
					globalAdventureType === 'climb' && 'current-adventure-type'
				)}
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
				className={cx(
					'adventure-pill-button',
					globalAdventureType === 'hike' && 'current-adventure-type'
				)}
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
