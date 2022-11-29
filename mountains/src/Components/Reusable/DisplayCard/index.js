import { useEffect, useState } from 'react'
import cx from 'classnames'

import { useCardStateContext } from '../../../Providers'
import DisplayHeader from './DisplayHeader'

import './styles.css'

export const DisplayCard = ({ children, onClose = () => {}, configuration = 'left' }) => {
	const { displayCardBoolState, cardDispatch } = useCardStateContext()
	const [displayState, setDisplayState] = useState(0)

	useEffect(() => {
		if (displayCardBoolState) {
			setDisplayState(1)
			setTimeout(() => {
				setDisplayState(2)
			}, 0)
		} else {
			setDisplayState(3)
		}
	}, [displayCardBoolState])

	const handleFinishedTransition = () => {
		if (displayState === 3) {
			onClose()
			cardDispatch({ type: 'closeCard' })
			setDisplayState(0)
		}
	}

	return (
		<div
			onTransitionEnd={handleFinishedTransition}
			className={cx(
				'display-card-container flex-box',
				configuration,
				displayState === 1 && 'opening',
				displayState === 2 && 'open',
				displayState === 3 && 'closing'
			)}
		>
			<div className={`display-card`}>
				<DisplayHeader onClose={() => setDisplayState(3)} />
				<div className='display-content flex-box'>{children}</div>
			</div>
		</div>
	)
}
