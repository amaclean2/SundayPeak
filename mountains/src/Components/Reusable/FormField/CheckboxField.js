import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

const CheckboxField = ({ className, name, value, onChange, label }) => {
	const [toggleState, setToggleState] = useState(!!value)

	const handleChange = (e) => {
		setToggleState(!toggleState)
	}

	const handleLabelClick = (e) => {
		e.stopPropagation()
		setToggleState(!toggleState)
	}

	useEffect(() => {
		onChange({
			target: {
				value: toggleState,
				name
			}
		})
	}, [toggleState])

	return (
		<label
			htmlFor={name}
			className={cx('checkbox', className, 'label-field')}
			onClick={handleLabelClick}
		>
			<input
				className={'hidden-checkbox'}
				type='checkbox'
				id={name}
				name={name}
				checked={toggleState}
				onChange={handleChange}
			/>
			<div className='checkbox-illus' />
			{label}
		</label>
	)
}

CheckboxField.propTypes = {
	className: PropTypes.string,
	name: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onChange: PropTypes.func,
	label: PropTypes.string
}

export default CheckboxField
