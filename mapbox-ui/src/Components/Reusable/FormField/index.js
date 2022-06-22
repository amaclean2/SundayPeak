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
	const [checkboxState, setCheckboxState] = useState(false);
	const [selectManyState, setSelectManyState] = useState([]);
	const [componentLoaded, setComponentLoaded] = useState(false);

	const handleChange = (e) => {
		onChange(e);
		setWorkingValue(e.target.value);
	};

	const handleCheckboxState = (e) => {
		setCheckboxState(!checkboxState);
		handleChange(e);
	}

	const handleSelectManyState = (e) => {
		if (selectManyState.includes(e.target.value)) {
			const index = selectManyState.indexOf(e.target.value);

			setSelectManyState((currArray) => {
				return [...currArray.slice(0, index), ...currArray.slice(index + 1)];
			});
		} else {
			setSelectManyState([...selectManyState, e.target.value]);
		}
	};

	useEffect(() => {
		if (componentLoaded) {
			handleChange({
				target: {
					name,
					value: selectManyState
				}
			});
		} else {
			setComponentLoaded(true);
		}
	}, [selectManyState]);

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
			case 'checkbox':
				return (
					<CheckboxField
						className={className}
						name={name}
						value={workingValue}
						onChange={handleChange}
					/>
				);
			case 'selectMany':
				return (
					<SelectManyField
						className={className}
						options={options}
						onChange={handleSelectManyState}
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

	return (
		<div className={cx('form-field-container', (fullWidth && 'wide'), (block && 'block'), (!isEditable && 'static'))} >
			{!hideLabel && <label htmlFor={name} className={cx(type, className, 'label-field')}>
				{isEditable && type === 'checkbox' && inputBox()}
				{label}
			</label>}
			{isEditable && type !== 'checkbox' && inputBox()}
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