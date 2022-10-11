import cx from 'classnames'

const SelectField = ({ className, options, name, placeholder, value, onChange }) => {
	const { selectOptions } = options
	return (
		<select
			className={cx('select form-field', className)}
			name={name}
			value={value || '0'}
			onChange={onChange}
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

export default SelectField
