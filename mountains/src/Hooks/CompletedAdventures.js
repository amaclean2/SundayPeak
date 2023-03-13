import { useGetAdventure } from './Adventures'
import { useUserStateContext } from './Providers'
import { fetcher } from './Providers/utils'

export const useSaveCompletedAdventure = () => {
	const { userDispatch } = useUserStateContext()
	const { getAdventure } = useGetAdventure()

	const saveCompletedAdventure = ({ adventureId, adventureType }) => {
		return fetcher(`/completed_adventures/create`, {
			method: 'POST',
			body: {
				adventure_id: adventureId,
				public: false
			}
		})
			.then(({ data: { user } }) => {
				userDispatch({ type: 'loginUser', payload: user })
				return getAdventure({ id: adventureId, type: adventureType })
			})
			.catch(console.error)
	}

	return saveCompletedAdventure
}
