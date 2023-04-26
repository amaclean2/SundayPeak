import cx from 'classnames'
import { useEffect, useState } from 'react'
import { useCardStateContext, useManipulateFlows } from '@amaclean2/sundaypeak-treewells'

import './styles.css'

const Alert = ({ className, type }) => {
	const { showAlert, alertContent } = useCardStateContext()
	const { closeAlert } = useManipulateFlows()
	const [displayState, setDisplayState] = useState(0)

	useEffect(() => {
		if (showAlert) {
			setDisplayState(1)
			setTimeout(() => {
				closeAlert()
				setDisplayState(2)
			}, 5000)
		}
	}, [showAlert])

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
