import { MessagingStateProvider } from 'Providers'
import MessagingContianer from './MessagingContainer'
import './styles.css'

const Plan = () => {
	return (
		<MessagingStateProvider>
			<MessagingContianer />
		</MessagingStateProvider>
	)
}

export default Plan
