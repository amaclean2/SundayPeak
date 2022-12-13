import cx from 'classnames'
import { CarretIcon } from 'Images'
import { useState } from 'react'

import { FlexSpacer } from '..'

import './styles.css'

export const Accordion = ({ children, className = '', title }) => {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<div className={cx('accordion', className, !isOpen && 'accordion-closed')}>
			<div
				className='accordion-top flex-box'
				onClick={() => setIsOpen(!isOpen)}
			>
				<span>{title}</span>
				<FlexSpacer />
				<CarretIcon
					color={'#AAA'}
					size={15}
					className={'accordion-expander'}
				/>
			</div>
			<div className={'accordion-content-wrapper'}>{children}</div>
		</div>
	)
}
