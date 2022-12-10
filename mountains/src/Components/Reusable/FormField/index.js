import PropTypes from 'prop-types'
import cx from 'classnames'

import PasswordInputField from './PasswordInputField'
import './styles.css'
import CheckboxField from './CheckboxField'
import SelectManyField from './SelectManyField'
import RangeInputField from './RangeInputField'
import TextareaField from './TextareaField'
import SelectField from './SelectField'
import DefaultField from './DefaultField'
import NoEditField from './NoEditField'

const InputBox = ({ field, onChange, value }) => {
	switch (field.type) {
		case 'password':
			return (
				<PasswordInputField
					{...field}
					onChange={onChange}
					value={value}
				/>
			)
		case 'selectmany':
			return (
				<SelectManyField
					{...field}
					onChange={onChange}
					value={value}
				/>
			)
		case 'range':
			return (
				<RangeInputField
					{...field}
					onChange={onChange}
					value={value}
				/>
			)
		case 'textarea':
			return (
				<TextareaField
					{...field}
					onChange={onChange}
					value={value}
				/>
			)
		case 'select':
			return (
				<SelectField
					{...field}
					onChange={onChange}
					value={value}
				/>
			)
		case 'noedit':
			return (
				<NoEditField
					{...field}
					value={value}
				/>
			)
		default:
			return (
				<DefaultField
					{...field}
					onChange={onChange}
					value={value}
				/>
			)
	}
}

export const FormField = (props) => {
	// props need to be an object because when I'm rendering an input with multiple fields
	// I need to pass the whole props object in
	const {
		id,
		type = 'text',
		name,
		label = '',
		value,
		isEditable = false,
		className = '',
		hideLabel = false,
		fullWidth = false,
		block = false,
		onChange
	} = props

	const renderNonCheckbox = () => (
		<>
			{!hideLabel && (
				<label
					htmlFor={name}
					className={cx(type, className, 'label-field')}
				>
					{label}
				</label>
			)}
			{isEditable && (
				<InputBox
					field={props}
					value={[null, undefined].includes(value) ? '' : value}
					onChange={onChange}
				/>
			)}
		</>
	)

	return (
		<div
			id={id || name}
			className={cx(
				'form-field-container',
				fullWidth && 'wide',
				block && 'block',
				!isEditable && 'static'
			)}
		>
			{isEditable && type === 'checkbox' ? (
				<CheckboxField
					className={className}
					name={name}
					value={[null, undefined].includes(value) ? '' : value}
					onChange={onChange}
					label={label}
				/>
			) : (
				renderNonCheckbox()
			)}
		</div>
	)
}

FormField.propTypes = {
	id: PropTypes.number,
	type: PropTypes.oneOf([
		'text',
		'select',
		'textarea',
		'range',
		'selectmany',
		'password',
		'checkbox',
		'email',
		'tel',
		'noedit',
		''
	]),
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	value: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
		PropTypes.array,
		PropTypes.bool,
		PropTypes.node
	]),
	isEditable: PropTypes.bool.isRequired,
	className: PropTypes.string,
	hideLabel: PropTypes.bool,
	fullWidth: PropTypes.bool,
	block: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	options: PropTypes.shape({
		onEnter: PropTypes.func
	})
}
