import { useUserStateContext } from '../userStateProvider'
import { fetcher } from '../utils'

export const useSaveActivity = () => {
	const { setLoggedInUser, setWorkingUser } = useUserStateContext()

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
			})
			.catch(console.error)
	}

	return {
		saveActivity
	}
}
