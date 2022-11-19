import cx from 'classnames'
import { useEffect, useState } from 'react'
import { useCardStateContext } from '../../../Providers'

import './styles.css'

const Alert = ({ className, type }) => {
	const { showAlert, alertContent, cardDispatch } = useCardStateContext()
	const [displayState, setDisplayState] = useState(0)

	useEffect(() => {
		if (showAlert) {
			setDisplayState(1)
			setTimeout(() => {
				cardDispatch({ type: 'closeAlert', payload: '' })
				setDisplayState(2)
			}, 10000)
		}
	}, [showAlert, cardDispatch])

	const handleEndTransition = () => {
		displayState === 2 && setDisplayState(0)
	}

	return (
		<div
			onTransitionEnd={handleEndTransition}
			className={cx(
				'alert flex-box',
				type,
				className,
				displayState === 1 && 'show-alert',
				displayState === 2 && 'fade-alert'
			)}
		>
			{alertContent}
		</div>
	)
}

export default Alert
