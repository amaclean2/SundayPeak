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
		onChange,
		testId,
		minWidth = false,
		reverse = false
	} = props

	const renderNonCheckbox = () => (
		<>
			{!hideLabel && label && (
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
				minWidth === false && 'full-width',
				!isEditable && 'static',
				type === 'noedit' && 'no-edit'
			)}
		>
			{isEditable && type === 'checkbox' ? (
				<CheckboxField
					className={className}
					name={name}
					value={[null, undefined].includes(value) ? false : value}
					testId={testId}
					onChange={onChange}
					label={label}
					reverse={reverse}
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
	label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	value: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
		PropTypes.array,
		PropTypes.bool,
		PropTypes.node
	]),
	testId: PropTypes.string,
	isEditable: PropTypes.bool.isRequired,
	className: PropTypes.string,
	hideLabel: PropTypes.bool,
	fullWidth: PropTypes.bool,
	block: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	reverse: PropTypes.bool,
	options: PropTypes.shape({
		onEnter: PropTypes.func
	})
}
