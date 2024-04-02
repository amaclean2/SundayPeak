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

const AdventureEditorForm = () => {
	const { currentAdventure } = useAdventureStateContext()
	const { loggedInUser } = useUserStateContext()
	const { getAdventure } = useGetAdventures()
	const { adventureId, adventureType } = useParams()
	const { pathname } = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		if (!currentAdventure) {
			// fetch the new adventure from the adventureId
			try {
				getAdventure({ id: adventureId, type: adventureType })
			} catch (error) {
				console.log({ error })
			}
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
			return <ClimbForm />
		case 'hike':
			return <HikeForm />
		case 'bike':
			return <BikeForm />
		case 'skiApproach':
			return <SkiApproachForm />
		default:
			return <SkiForm />
	}
}

export default AdventureEditorForm
