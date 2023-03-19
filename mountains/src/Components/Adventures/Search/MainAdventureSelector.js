import cx from 'classnames'
import { useAdventureStateContext, useGetAdventures } from 'sundaypeak-treewells'

import { Button } from 'Components/Reusable'
import { LargeClimberIcon, LargeHikerIcon, LargeSkierIcon } from 'Images'

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
				<LargeSkierIcon
					size={svgSize}
					color={globalAdventureType === 'ski' ? '#FFF' : '#000'}
				/>
				Ski
			</Button>
			<Button
				id='set-climb-adventure-type'
				className={cx(globalAdventureType === 'climb' && 'current-adventure-type')}
				onClick={() => changeAdventureType({ type: 'climb' })}
			>
				<LargeClimberIcon
					size={svgSize}
					color={globalAdventureType === 'climb' ? '#FFF' : '#000'}
				/>
				Climb
			</Button>
			<Button
				id='set-hike-adventure-type'
				className={cx(globalAdventureType === 'hike' && 'current-adventure-type')}
				onClick={() => changeAdventureType({ type: 'hike' })}
			>
				<LargeHikerIcon
					size={svgSize}
					color={globalAdventureType === 'hike' ? '#FFF' : '#000'}
				/>
				Hike
			</Button>
		</div>
	)
}

export default MainAdventureSelector
