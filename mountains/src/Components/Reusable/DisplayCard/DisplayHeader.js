import cx from 'classnames'
import { CarretIcon } from '../../../Images'
import { Button } from '../Button'

const DisplayHeader = ({ className, onClose }) => {
	const localOnClose = (e) => {
		onClose(e)
	}

	return (
		<div className={cx(className, 'display-header')}>
			<div className='display-header-spacer' />
			<Button
				id='display-back-button'
				className='display-back-button flex-box'
				onClick={localOnClose}
			>
				<CarretIcon color={'#FFFFFF'} />
			</Button>
		</div>
	)
}

export default DisplayHeader
