import React from 'react'
import cx from 'classnames'

import { useCardStateContext } from '../../../Providers'
import DisplayHeader from './DisplayHeader'

import './styles.css'

export const DisplayCard = ({ children, onClose = () => {}, configuration = 'left' }) => {
	const { displayCardBoolState } = useCardStateContext()

	if (!displayCardBoolState) {
		return null
	}

	return (
		<div className={cx('display-card-container flex-box', configuration)}>
			<div className={`display-card`}>
				<DisplayHeader onClose={onClose} />
				<div className='display-content flex-box'>{children}</div>
			</div>
		</div>
	)
}
