import { useUserStateContext } from '../userStateProvider'
import { fetcher } from '../utils'
import { useGetAdventure } from './adventures'

export const useSaveActivity = () => {
	const { setLoggedInUser, setWorkingUser } = useUserStateContext()
	const { getAdventure } = useGetAdventure()

	const saveActivity = ({ adventureId }) => {
		return fetcher(`/activities/create`, {
			method: 'POST',
			body: {
				adventure_id: adventureId,
				public: false
			}
		})
			.then(({ data: { user } }) => {
				setLoggedInUser(user)
				setWorkingUser(user)
				return getAdventure({ id: adventureId })
			})
			.catch(console.error)
	}

	return {
		saveActivity
	}
}
