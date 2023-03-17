import { useGetAdventures } from '.'
import { useUserStateContext } from '../../Providers/UserStateProvider'
import { AdventureChoiceType } from '../../Types/Adventures'
import { fetcher } from '../../utils'
import { completedAdventures } from '../Apis'

export const useSaveCompletedAdventure = () => {
	const { userDispatch } = useUserStateContext()
	const { getAdventure } = useGetAdventures()

	const saveCompletedAdventure = ({
		adventureId,
		adventureType
	}: {
		adventureId: number
		adventureType: AdventureChoiceType
	}) => {
		return fetcher(completedAdventures.create.url, {
			method: completedAdventures.create.method,
			body: {
				adventure_id: adventureId,
				public: false
			}
		})
			.then(({ data: { user } }) => {
				userDispatch({ type: 'setLoggedInUser', payload: user })
				return getAdventure({ id: adventureId, type: adventureType })
			})
			.catch(console.error)
	}

	return saveCompletedAdventure
}
