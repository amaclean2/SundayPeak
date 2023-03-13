import cx from 'classnames'

import { Button } from 'Components/Reusable'
import { useGetAdventures } from 'Hooks'
import { useAdventureStateContext } from 'Hooks/Providers'
import { LargeClimberIcon, LargeHikerIcon, LargeSkierIcon } from 'Images'

const MainAdventureSelector = () => {
	const { adventureTypeViewer } = useAdventureStateContext()
	const { changeAdventureType } = useGetAdventures()

	const svgSize = 30

	return (
		<div className='adventure-pill-selector full-width flex-box'>
			<Button
				id='set-ski-adventure-type'
				className={cx(adventureTypeViewer === 'ski' && 'current-adventure-type')}
				onClick={() => changeAdventureType({ type: 'ski' })}
			>
				<LargeSkierIcon
					size={svgSize}
					color={adventureTypeViewer === 'ski' ? '#FFF' : '#000'}
				/>
				Ski
			</Button>
			<Button
				id='set-climb-adventure-type'
				className={cx(adventureTypeViewer === 'climb' && 'current-adventure-type')}
				onClick={() => changeAdventureType({ type: 'climb' })}
			>
				<LargeClimberIcon
					size={svgSize}
					color={adventureTypeViewer === 'climb' ? '#FFF' : '#000'}
				/>
				Climb
			</Button>
			<Button
				id='set-hike-adventure-type'
				className={cx(adventureTypeViewer === 'hike' && 'current-adventure-type')}
				onClick={() => changeAdventureType({ type: 'hike' })}
			>
				<LargeHikerIcon
					size={svgSize}
					color={adventureTypeViewer === 'hike' ? '#FFF' : '#000'}
				/>
				Hike
			</Button>
		</div>
	)
}

export default MainAdventureSelector
