import { useGetAdventures } from '.'
import { useUserStateContext } from '../../Providers/UserStateProvider'
import type { AdventureChoiceType, AdventureType } from '../../Types/Adventures'
import type {
	CompletedAdventureForUserType,
	TodoAdventureForUserType,
	UserType
} from '../../Types/User'
import { fetcher } from '../../utils'
import { completedAdventures } from '../Apis'

export const useSaveCompletedAdventure = (): {
	saveCompletedAdventure: ({
		adventureId,
		adventureType
	}: {
		adventureId: number
		adventureType: AdventureChoiceType
	}) => Promise<AdventureType>
} => {
	const { userDispatch, loggedInUser } = useUserStateContext()
	const { getAdventure } = useGetAdventures()

	const saveCompletedAdventure = async ({
		adventureId,
		adventureType
	}: {
		adventureId: number
		adventureType: AdventureChoiceType
	}): Promise<AdventureType> => {
		const {
			data: {
				completed: { user_completed_field }
			}
		} = await fetcher(completedAdventures.create.url, {
			method: completedAdventures.create.method,
			body: {
				adventure_id: adventureId,
				public: false
			}
		})

		userDispatch({
			type: 'setLoggedInUser',
			payload: {
				...(loggedInUser as UserType),
				completed_adventures: [
					...(loggedInUser?.completed_adventures as CompletedAdventureForUserType[]),
					user_completed_field
				],
				todo_adventures: loggedInUser?.todo_adventures.filter(
					(adventure) => adventure.adventure_id !== user_completed_field.adventure_id
				) as TodoAdventureForUserType[]
			}
		})

		return await getAdventure({ id: adventureId, type: adventureType })
	}

	return { saveCompletedAdventure }
}
