import React, { useMemo, useState } from 'react';
import cx from 'classnames';

import { useAdventureEditContext } from '../../../Providers';

import './styles.css';
import { Button } from '../Button';
import { CheckboxChecked, CheckboxEmpty } from '../../../Images';

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
	onChange = () => { }
}) => {
	const [workingValue, setWorkingValue] = useState(value);
	const [passwordShown, setPasswordShown] = useState(false);
	const [passwordFocus, setPasswordFocus] = useState(false);
	const [checkboxState, setCheckboxState] = useState(false);

	const handleChange = (e) => {
		onChange(e);
		setWorkingValue(e.target.value);
	};

	const handleCheckboxState = (e) => {
		setCheckboxState(!checkboxState);
		handleChange(e);
	}

	const inputBox = () => {
		switch (type) {
			case 'password':
				return (
					<div
						className={cx(type, 'form-field', 'flex-box', passwordFocus && 'focus')}
						onFocus={() => setPasswordFocus(true)}
						onBlur={() => setPasswordFocus(false)}
					>
						<input
							className={'password-input-field'}
							type={passwordShown ? 'text' : 'password'}
							name={name}
							id={name}
							autoComplete={autoComplete}
							placeholder={label}
							value={workingValue}
							onChange={handleChange}
						/>
						<Button
							className="password-switch-field"
							onClick={() => setPasswordShown(!passwordShown)}
						>
							{passwordShown ? 'Hide' : 'Show'}
						</Button>
					</div>
				)
			case 'checkbox':
				return (
					<div className={cx('form-field', 'checkbox', className)}>
						<input
							className={'hidden-checkbox'}
							type='checkbox'
							id={name}
							name={name}
							value={value}
							onChange={handleCheckboxState}
						/>
						{(checkboxState) ? <CheckboxChecked /> : <CheckboxEmpty />}
					</div>
				)
			default:
				return (
					<input
						className={cx(type, 'form-field')}
						type={type}
						name={name}
						id={name}
						autoComplete={autoComplete}
						placeholder={label}
						value={workingValue}
						onChange={handleChange}
					/>
				);
		}
	};

	return (
		<div className={cx('form-field-container', (fullWidth && 'wide'), (!isEditable && 'small'), (block && 'block'))} >
			{!hideLabel && <label htmlFor={name} className={cx(type, className, 'label-field')}>{label}</label>}
			{isEditable && inputBox()}
			{!isEditable && <span className={cx(type, className, 'form-field-static')}>{workingValue}</span>}
		</div>
	)
};