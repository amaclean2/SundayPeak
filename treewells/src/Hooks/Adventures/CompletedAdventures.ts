import { useGetAdventures } from '.'
import { useUserStateContext } from '../../Providers/UserStateProvider'
import { AdventureChoiceType } from '../../Types/Adventures'
import { CompletedAdventureForUserType, TodoAdventureForUserType, UserType } from '../../Types/User'
import { fetcher } from '../../utils'
import { completedAdventures } from '../Apis'

export const useSaveCompletedAdventure = () => {
	const { userDispatch, loggedInUser } = useUserStateContext()
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
			.then(
				({
					data: {
						completed: { user_completed_field }
					}
				}) => {
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
					return getAdventure({ id: adventureId, type: adventureType })
				}
			)
			.catch(console.error)
	}

	return saveCompletedAdventure
}
