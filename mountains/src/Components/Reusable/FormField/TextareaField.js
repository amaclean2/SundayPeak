import cx from 'classnames'
import { placeholderDefinition } from './utils'

const TextareaField = ({ className, hideLabel, label, placeholder, name, onChange, value }) => {
	return (
		<textarea
			className={cx('text-area', 'form-field', className)}
			placeholder={placeholderDefinition({ placeholder, label, hideLabel })}
			name={name}
			id={name}
			onChange={onChange}
			value={value}
		/>
	)
}

export default TextareaField
