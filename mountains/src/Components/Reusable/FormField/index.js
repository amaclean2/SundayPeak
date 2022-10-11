import React, { useState } from 'react'
import cx from 'classnames'
import PasswordInputField from './PasswordInputField'

import './styles.css'
import CheckboxField from './CheckboxField'
import SelectManyField from './SelectManyField'
import RangeInputField from './RangeInputField'
import TextareaField from './TextareaField'
import SelectField from './SelectField'
import DefaultField from './DefaultField'

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
		case 'selectMany':
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
		name = '',
		label = '',
		value = '',
		isEditable = false,
		className = '',
		hideLabel = false,
		fullWidth = false,
		block = false,
		onChange = () => {}
	} = props

	const [workingValue, setWorkingValue] = useState(value === null ? '' : value)

	const handleChange = (e) => {
		onChange(e)
		setWorkingValue(e.target.value)
	}

	const getInputValue = (workingField) => {
		if (workingValue === undefined || workingValue === '') {
			return workingField?.value || ''
		} else {
			return workingValue
		}
	}

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
					value={getInputValue(value)}
					onChange={handleChange}
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
					value={workingValue}
					onChange={handleChange}
					label={label}
				/>
			) : (
				renderNonCheckbox()
			)}
		</div>
	)
}
