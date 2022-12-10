import cx from 'classnames'

import './styles.css'

export const ConfirmationPage = ({ children, className }) => (
	<div className={cx('confirmation', className)}>{children}</div>
)
