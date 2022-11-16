import cx from 'classnames'
import PropTypes from 'prop-types'

import { placeholderDefinition } from './utils'

const DefaultField = ({
	type,
	className,
	name,
	autoComplete,
	hideLabel,
	label,
	value,
	options,
	placeholder,
	onChange,
	autoFocus = false
}) => {
	return (
		<input
			className={cx(type || 'text', 'form-field', className)}
			pattern={options?.pattern || null}
			type={type}
			name={name}
			id={name}
			autoComplete={autoComplete}
			placeholder={placeholderDefinition({ placeholder, hideLabel, label })}
			value={value}
			onChange={onChange}
			autoFocus={autoFocus}
		/>
	)
}

DefaultField.propTypes = {
	type: PropTypes.string,
	className: PropTypes.string,
	name: PropTypes.string,
	autoComplete: PropTypes.string,
	hideLabel: PropTypes.bool,
	label: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	options: PropTypes.shape(),
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
	autoFocus: PropTypes.bool
}

export default DefaultField
