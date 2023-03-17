import { useCardStateContext } from '../../Providers/CardStateProvider'
import { useUserStateContext } from '../../Providers/UserStateProvider'
import { UserType } from '../../Types/User'

export const useHandleUserResponses = () => {
	const { userDispatch } = useUserStateContext()
	const { cardDispatch } = useCardStateContext()

	const handleCreateUserResponse = ({ user, token }: { user: UserType; token: string }) => {
		cardDispatch({
			type: 'closeCardMessage',
			payload: `User ${user.first_name} ${user.last_name} created!\nGet started with a new adventure.`
		})
		userDispatch({ type: 'setLoggedInUser', payload: user })
		localStorage.setItem('token', token)

		return { user, token }
	}

	const handleLoginUserResponse = ({ user, token }: { user: UserType; token: string }) => {
		userDispatch({ type: 'setLoggedInUser', payload: user })
		localStorage.setItem('token', token)
		return { user, token }
	}

	return {
		handleCreateUserResponse,
		handleLoginUserResponse
	}
}
