import cx from 'classnames'
import PropTypes from 'prop-types'

const SelectField = ({
	className,
	options = {},
	name,
	placeholder,
	value,
	onChange,
	testId,
	autoFocus = false
}) => {
	const { selectOptions = [] } = options
	return (
		<select
			className={cx('select form-field', className)}
			name={name}
			data-testid={testId}
			value={value || '0'}
			onChange={onChange}
			autoFocus={autoFocus}
		>
			{placeholder && (
				<option
					disabled
					value={'0'}
				>
					{placeholder}
				</option>
			)}
			{selectOptions.map((option, key) => (
				<option
					key={`select_${name}_${key}`}
					value={option.value}
					id={option.id}
				>
					{option.text || option.value}
				</option>
			))}
		</select>
	)
}

SelectField.propTypes = {
	className: PropTypes.string,
	options: PropTypes.object,
	name: PropTypes.string,
	placeholder: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onChange: PropTypes.func,
	testId: PropTypes.string,
	autoFocus: PropTypes.bool
}

export default SelectField
