import cx from 'classnames'
import { useState } from 'react'

import { FlexSpacer } from '..'

import './styles.css'

export const Accordion = ({ children, className = '', title }) => {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<div className={cx('accordion', className)}>
			<div
				className='accordion-top flex-box'
				onClick={() => setIsOpen(!isOpen)}
			>
				<span>{title}</span>
				<FlexSpacer />
				<div className='accordion-caret' />
			</div>
			<div className={cx('accordion-content-wrapper', !isOpen && 'accordion-closed')}>
				{children}
			</div>
		</div>
	)
}
