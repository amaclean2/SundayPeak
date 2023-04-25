import cx from 'classnames'
import PropTypes from 'prop-types'
import { placeholderDefinition } from './utils'

const TextareaField = ({
	className,
	hideLabel,
	label,
	placeholder,
	name,
	onChange,
	value,
	testId,
	autoFocus = false
}) => {
	return (
		<textarea
			className={cx('text-area', 'form-field', className)}
			data-testid={testId ?? name}
			placeholder={placeholderDefinition({ placeholder, label, hideLabel })}
			autoFocus={autoFocus}
			name={name}
			id={name}
			onChange={onChange}
			value={value}
		/>
	)
}

TextareaField.propTypes = {
	className: PropTypes.string,
	hideLabel: PropTypes.bool,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	name: PropTypes.string,
	onChange: PropTypes.func,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
	testId: PropTypes.string,
	autoFocus: PropTypes.bool
}

export default TextareaField
