import { Link } from 'react-router-dom'
import { useUserStateContext } from 'sundaypeak-treewells'

import { DisplayCard } from 'Components/Reusable'

import AdventureSearch from './Search'
import MainAdventureSelector from './Search/MainAdventureSelector'

import './styles.css'

const DefaultAdventureView = () => {
	const { loggedInUser } = useUserStateContext()
	return (
		<DisplayCard title={'Adventures'}>
			<MainAdventureSelector />
			<AdventureSearch />
			{loggedInUser?.id && (
				<Link
					id={'open-new-adventure-menu'}
					to={'/adventure/new'}
					className={'button flex-box'}
				>
					Add a New Adventure
				</Link>
			)}
		</DisplayCard>
	)
}

export default DefaultAdventureView
