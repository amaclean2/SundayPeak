import { useState } from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { CarretIcon } from '../../../Images'
import { Button } from '../Button'
import { MenuButton } from '../Menu'
import { FormField } from '../FormField'
import { useManipulateFlows } from 'State'

const HeaderSearch = ({
	value,
	onChange,
	placeholder = 'Search',
	autoFocus = false,
	testId = 'display-header-search'
}) => {
	const [localValue, setLocalValue] = useState('')
	const isControlled = value !== undefined

	const handleChange = (e) => {
		if (!isControlled) setLocalValue(e.target.value)
		onChange?.(e.target.value, e)
	}

	return (
		<FormField
			type='text'
			name='display_header_search'
			className='display-header-search'
			value={isControlled ? value : localValue}
			isEditable
			testId={testId}
			fullWidth
			placeholder={placeholder}
			onChange={handleChange}
			autoFocus={autoFocus}
		/>
	)
}

HeaderSearch.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
	placeholder: PropTypes.string,
	autoFocus: PropTypes.bool,
	testId: PropTypes.string
}

const DisplayHeader = ({ className, onClose, menu, hasClose = true, search }) => {
	const navigate = useNavigate()
	const { clearErrors } = useManipulateFlows()

	const localOnClose = (e) => {
		clearErrors()
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
					<CarretIcon
						color={'#FFFFFF'}
						size={10}
					/>
				</Button>
			)}
			<div className='display-header-spacer'>{search && <HeaderSearch {...search} />}</div>
			{menu && <MenuButton />}
		</div>
	)
}

DisplayHeader.propTypes = {
	className: PropTypes.string,
	onClose: PropTypes.func,
	menu: PropTypes.bool,
	hasClose: PropTypes.bool,
	search: PropTypes.shape(HeaderSearch.propTypes)
}

export default DisplayHeader
