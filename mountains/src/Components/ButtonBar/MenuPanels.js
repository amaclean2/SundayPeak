import { useLocation, useNavigate } from 'react-router-dom'
import { CARD_TYPES, useCardStateContext, useUserStateContext } from '../../Providers'
import AdventureEditor from '../AdventureEditor'
import { LoginFlow, NewPassword, PasswordResetCapture, SignupFlow } from '../SignupFlow'
import UserProfile from '../UserProfile'

const MenuPanels = () => {
	const { displayCardBoolState, workingCard, cardDispatch } = useCardStateContext()
	const { loggedInUser } = useUserStateContext()
	const { pathname } = useLocation()
	const navigate = useNavigate()

	if ((pathname.includes('/signup') || pathname.includes('/login')) && !!loggedInUser) {
		navigate('/discover')
		cardDispatch({ type: 'closeCard' })
	}

	return (
		<>
			{displayCardBoolState && workingCard === CARD_TYPES.profile && <UserProfile />}
			{displayCardBoolState && workingCard === CARD_TYPES.password_reset && (
				<PasswordResetCapture />
			)}
			{((displayCardBoolState && workingCard === CARD_TYPES.signup) ||
				pathname.includes('/signup')) && <SignupFlow />}
			{((displayCardBoolState && workingCard === CARD_TYPES.login) ||
				pathname.includes('/login')) && <LoginFlow />}
			{pathname.includes('/password') && <NewPassword />}
			{((displayCardBoolState && workingCard === CARD_TYPES.adventures) ||
				pathname.includes('/adventure')) && <AdventureEditor />}
		</>
	)
}

export default MenuPanels
