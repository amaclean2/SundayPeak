import cx from 'classnames'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { CarretIcon } from '../../../Images'
import { Button } from '../Button'
import { MenuButton } from '../Menu'

const DisplayHeader = ({ className, onClose, title, menu, hasClose = true }) => {
	const navigate = useNavigate()

	const localOnClose = (e) => {
		return onClose ? onClose(e) : navigate(-1)
	}

	return (
		<div className={cx(className, 'display-header flex-box')}>
			{hasClose && (
				<Button
					id='display-back-button'
					className='display-back-button'
					onClick={localOnClose}
				>
					<CarretIcon color={'#FFFFFF'} />
				</Button>
			)}
			<div className={'display-card-header-contents full-width'}>{title || ''}</div>
			<div className='display-header-spacer' />
			{menu && <MenuButton />}
		</div>
	)
}

DisplayHeader.propTypes = {
	className: PropTypes.string,
	onClose: PropTypes.func,
	title: PropTypes.node,
	menu: PropTypes.bool,
	hasClose: PropTypes.bool
}

export default DisplayHeader
