import cx from 'classnames'
import { Button } from '../Button'

import './styles.css'

const ConfirmationPage = ({ type, children, className }) => {
	if (type === 'delete') {
		return (
			<div className={cx('confirmation', className)}>
				<div>{children}</div>
			</div>
		)
	} else {
		return (
			<>
				<div>Some other confirmation</div>
			</>
		)
	}
}

export default ConfirmationPage
