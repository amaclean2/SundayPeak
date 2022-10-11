import cx from 'classnames'

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
	onChange
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
		/>
	)
}

export default DefaultField
