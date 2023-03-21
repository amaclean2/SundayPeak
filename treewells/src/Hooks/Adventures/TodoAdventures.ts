import type { AdventureChoiceType, AdventureType } from '../../Types/Adventures'
import { fetcher } from '../../utils'
import { todoAdventures } from '../Apis'
import { useHandleAdventureResponses } from './handleResponses'

export const useSaveTodo = (): {
	saveTodo: ({
		adventureId,
		adventureType
	}: {
		adventureId: number
		adventureType: AdventureChoiceType
	}) => Promise<AdventureType>
} => {
	const { handleSaveTodo } = useHandleAdventureResponses()

	const saveTodo = async ({
		adventureId,
		adventureType
	}: {
		adventureId: number
		adventureType: AdventureChoiceType
	}): Promise<AdventureType> => {
		const {
			data: { todo }
		} = await fetcher(todoAdventures.create.url, {
			method: todoAdventures.create.method,
			body: {
				adventure_id: adventureId,
				public: false
			}
		})

		return await handleSaveTodo({ todo })
	}

	return {
		saveTodo
	}
}
