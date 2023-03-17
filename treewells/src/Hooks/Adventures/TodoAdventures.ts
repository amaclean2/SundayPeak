import { AdventureChoiceType } from '../../Types/Adventures'
import { fetcher } from '../../utils'
import { todoAdventures } from '../Apis'
import { useHandleAdventureResponses } from './handleResponses'

export const useSaveTodo = () => {
	const { handleSaveTodo } = useHandleAdventureResponses()

	const saveTodo = ({
		adventureId,
		adventureType
	}: {
		adventureId: number
		adventureType: AdventureChoiceType
	}) => {
		fetcher(todoAdventures.create.url, {
			method: todoAdventures.create.method,
			body: {
				adventure_id: adventureId,
				public: false
			}
		})
			.then(({ data: { todo } }) => handleSaveTodo({ todo }))
			.catch(console.error)
	}

	return saveTodo
}
