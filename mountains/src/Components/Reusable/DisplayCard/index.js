import PropTypes from 'prop-types'
import cx from 'classnames'

import DisplayHeader from './DisplayHeader'
import { FieldProps } from '../Menu'

import './styles.css'

export const DisplayCard = ({
	children,
	onClose,
	configuration = 'left',
	className,
	title,
	menu,
	testId
}) => {
	return (
		<div
			className={cx('display-card-container flex-box', className, configuration)}
			data-testid={testId}
		>
			<div className={`display-card`}>
				<DisplayHeader
					title={title}
					onClose={onClose}
					menu={menu}
				/>
				<div className='display-content flex-box'>{children}</div>
			</div>
		</div>
	)
}

DisplayCard.propTypes = {
	children: PropTypes.node,
	onClose: PropTypes.func,
	configuration: PropTypes.oneOf(['left', 'right', 'center']),
	className: PropTypes.string,
	title: PropTypes.node,
	menu: PropTypes.shape({
		fields: FieldProps
	})
}
