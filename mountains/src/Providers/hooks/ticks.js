import { useUserStateContext } from '../userStateProvider'
import { fetcher } from '../utils'
import { useGetAdventure } from './adventures'

export const useSaveTick = () => {
	const { setLoggedInUser, setWorkingUser } = useUserStateContext()
	const getAdventure = useGetAdventure()

	const saveTick = ({ adventureId }) => {
		fetcher(`/ticks/create`, {
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

	return saveTick
}
