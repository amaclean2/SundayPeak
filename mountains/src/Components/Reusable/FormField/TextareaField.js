import cx from 'classnames'
import { placeholderDefinition } from './utils'

const TextareaField = ({
	className,
	hideLabel,
	label,
	placeholder,
	name,
	onChange,
	value,
	autoFocus = false
}) => {
	return (
		<textarea
			className={cx('text-area', 'form-field', className)}
			placeholder={placeholderDefinition({ placeholder, label, hideLabel })}
			autoFocus={autoFocus}
			name={name}
			id={name}
			onChange={onChange}
			value={value}
		/>
	)
}

export default TextareaField
