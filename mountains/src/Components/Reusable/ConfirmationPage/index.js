import cx from 'classnames'

import './styles.css'

const ConfirmationPage = ({ children, className }) => (
	<div className={cx('confirmation', className)}>{children}</div>
)

export default ConfirmationPage
