import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { Button } from '../Button';
import PasswordInputField from './PasswordInputField';

import './styles.css';
import CheckboxField from './CheckboxField';
import SelectManyField from './SelectManyField';
import RangeInputField from './RangeInputField';
import TextareaField from './TextareaField';
import StaticField from './StaticField';

export const FormField = ({
	id,
	type = 'text',
	name = '',
	label = '',
	value = '',
	isEditable = false,
	className = '',
	hideLabel = false,
	autoComplete = 'off',
	fullWidth = false,
	block = false,
	options = {},
	onChange = () => { }
}) => {
	const [workingValue, setWorkingValue] = useState(value);

	const handleChange = (e) => {
		onChange(e);
		setWorkingValue(e.target.value);
	};

	const inputBox = () => {
		switch (type) {
			case 'password':
				return <PasswordInputField
					className={className}
					name={name}
					label={label}
					hideLabel={hideLabel}
					value={workingValue}
					onChange={handleChange}
				/>;
			case 'selectMany':
				return (
					<SelectManyField
						className={className}
						options={options}
						onChange={handleChange}
						name={name}
						value={value}
					/>
				);
			case 'range':
				return (
					<RangeInputField
						className={className}
						name={name}
						value={workingValue}
						options={options}
						onChange={handleChange}
					/>
				);
			case 'textarea':
				return (
					<TextareaField
						className={className}
						hideLabel={hideLabel}
						label={label}
						name={name}
						onChange={handleChange}
						value={workingValue}
					/>
				);
			default:
				return (
					<input
						className={cx(type, 'form-field', className)}
						type={type}
						name={name}
						id={name}
						autoComplete={autoComplete}
						placeholder={hideLabel ? label : ''}
						value={workingValue}
						onChange={handleChange}
					/>
				);
		}
	};

	const nonCheckboxField = () => (
		<>
			{!hideLabel && <label htmlFor={name} className={cx(type, className, 'label-field')}>
				{label}
			</label>}
			{isEditable && inputBox()}
		</>
	);

	return (
		<div
			id={id || name}
			className={cx('form-field-container', (fullWidth && 'wide'), (block && 'block'), (!isEditable && 'static'))}
		>
			{(isEditable && type === 'checkbox') ? (
				<CheckboxField
					className={className}
					name={name}
					value={workingValue}
					onChange={handleChange}
					label={label}
				/>) : nonCheckboxField()}
			{!isEditable && (
				<StaticField
					value={workingValue}
					type={type}
					className={className}
					options={options}
					name={name}
				/>
			)}
		</div>
	)
};