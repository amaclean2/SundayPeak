import cx from 'classnames'
import { useState } from 'react'

import Hamburger from '../../../Images/Hamburger'
import { Button } from '../Button'

import './styles.css'

export const MobileMenu = ({ children, className, direction }) => {
	const [openState, setOpenState] = useState(false)
	return (
		<div className='mobile-menu'>
			<Button
				id='hamburger'
				className={'mobile-button'}
				onClick={() => setOpenState(true)}
			>
				<Hamburger />
			</Button>
			<div
				className={cx('mobile-menu-background', openState && 'open')}
				onClick={() => setOpenState(false)}
			/>
			<div className={cx('mobile-menu-drop flex-box', className, openState && 'open', direction)}>
				{children}
			</div>
		</div>
	)
}
