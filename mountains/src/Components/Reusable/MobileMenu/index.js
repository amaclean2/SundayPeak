import cx from 'classnames'
import { useState } from 'react'

import MobileMenuHeader from './MobileMenuHeader'

import './styles.css'

export const MobileMenu = ({ children, className, direction }) => {
	const [openState, setOpenState] = useState(false)
	return (
		<div className='mobile-menu'>
			<div
				className={cx('mobile-menu-background', openState && 'open')}
				onClick={() => setOpenState(false)}
			/>
			<div className={cx('mobile-menu-drop flex-box', className, openState && 'open', direction)}>
				<MobileMenuHeader handleClose={() => setOpenState(!openState)} />
				{children}
			</div>
		</div>
	)
}
