import { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
	useAdventureStateContext,
	useGetAdventures,
	useUserStateContext
} from '@amaclean2/sundaypeak-treewells'

import ClimbForm from './ClimbForm'
import HikeForm from './HikeForm'
import SkiForm from './SkiForm'
import BikeForm from './BikeForm'
import SkiApproachForm from './SkiApproachForm'
import { useAdventureMenu } from '../Buttons/utils'

import './styles.css'

const AdventureEditorForm = () => {
	const { currentAdventure } = useAdventureStateContext()
	const { loggedInUser } = useUserStateContext()
	const { getAdventure } = useGetAdventures()
	const { adventureId, adventureType } = useParams()
	const { pathname } = useLocation()
	const navigate = useNavigate()
	const { buildEditViewMenu } = useAdventureMenu()

	useEffect(() => {
		if (!currentAdventure) {
			// fetch the new adventure from the adventureId
			getAdventure({ id: adventureId, type: adventureType })
		}
	}, [])

	useEffect(() => {
		if (!loggedInUser) {
			navigate(pathname.replace('/edit', ''))
		}
	}, [loggedInUser])

	if (!currentAdventure) {
		return null
	}

	switch (currentAdventure.adventure_type) {
		case 'climb':
			return <ClimbForm menuContents={buildEditViewMenu()} />
		case 'hike':
			return <HikeForm menuContents={buildEditViewMenu()} />
		case 'bike':
			return <BikeForm menuContents={buildEditViewMenu()} />
		case 'skiApproach':
			return <SkiApproachForm menuContents={buildEditViewMenu()} />
		default:
			return <SkiForm menuContents={buildEditViewMenu()} />
	}
}

export default AdventureEditorForm
