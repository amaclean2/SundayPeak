import cx from 'classnames'
import { forwardRef } from 'react'

export const ProfileContent = forwardRef(({ className, children }, ref) => {
	return (
		<div
			ref={ref}
			className={cx('profile-content', className)}
		>
			{children}
		</div>
	)
})
