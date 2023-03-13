import { useGetAdventure } from './Adventures'
import { useAdventureStateContext, useUserStateContext } from './Providers'
import { fetcher } from './Providers/utils'

export const useSaveTodo = () => {
	const { userDispatch, loggedInUser } = useUserStateContext()
	const { adventureDispatch, currentAdventure } = useAdventureStateContext()
	const { getAdventure } = useGetAdventure()

	const saveTodo = ({ adventureId, adventureType }) => {
		fetcher(`/todo_adventures/create`, {
			method: 'POST',
			body: {
				adventure_id: adventureId,
				public: false
			}
		})
			.then(
				({
					data: {
						todo: { adventure_todo_field, user_todo_field }
					}
				}) => {
					userDispatch({
						type: 'loginUser',
						payload: {
							...loggedInUser,
							todo_adventures: [...loggedInUser.todo_adventures, user_todo_field]
						}
					})

					adventureDispatch({
						type: 'currentAdventure',
						payload: {
							...currentAdventure,
							todo_users: [...currentAdventure.todo_users, adventure_todo_field]
						}
					})
					return getAdventure({ id: adventureId, type: adventureType })
				}
			)
			.catch(console.error)
	}

	return saveTodo
}
