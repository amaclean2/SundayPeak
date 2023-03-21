import { Storage } from '../../config'
import { useCardStateContext } from '../../Providers/CardStateProvider'
import { useUserStateContext } from '../../Providers/UserStateProvider'
import type { UserType } from '../../Types/User'

export const useHandleUserResponses = (): {
	handleCreateUserResponse: ({ user, token }: { user: UserType; token: string }) => void
	handleLoginUserResponse: ({ user, token }: { user: UserType; token: string }) => void
} => {
	const { userDispatch } = useUserStateContext()
	const { cardDispatch } = useCardStateContext()

	const handleCreateUserResponse = ({ user, token }: { user: UserType; token: string }): void => {
		cardDispatch({
			type: 'closeCardMessage',
			payload: `User ${user.first_name} ${user.last_name} created!\nGet started with a new adventure.`
		})
		userDispatch({ type: 'setLoggedInUser', payload: user })
		void Storage.setItem('token', token)
	}

	const handleLoginUserResponse = ({ user, token }: { user: UserType; token: string }): void => {
		userDispatch({ type: 'setLoggedInUser', payload: user })
		void Storage.setItem('token', token)
	}

	return {
		handleCreateUserResponse,
		handleLoginUserResponse
	}
}
