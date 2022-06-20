import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { Button } from '../Button';

import './styles.css';

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
	selectMany = {},
	range = {},
	onChange = () => { }
}) => {
	const [workingValue, setWorkingValue] = useState(value);
	const [passwordShown, setPasswordShown] = useState(false);
	const [passwordFocus, setPasswordFocus] = useState(false);
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
							placeholder={hideLabel ? label : ''}
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
				);
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
						<div className="checkbox-illus" />
					</div>
				);
			case 'selectMany':
				return (
					<div className={cx('form-field', 'select-many', 'flex-box', className)}>
						{
							selectMany.options.map((option, key) => (
								<label htmlFor={option.name} className={cx('select-many-option', 'flex-box')} key={`select_many_option_${key}`}>
									<input
										type='checkbox'
										name={option.name}
										id={option.name}
										value={option.value}
										className={'hidden-checkbox'}
										onChange={handleSelectManyState}
									/>
									<div className="select-many-illus" />
									{option.name}
								</label>
							))
						}
					</div>
				);
			case 'range':
				return (
					<input
						type="range"
						className={cx('slider', 'form-field', className)}
						name={name}
						id={name}
						value={workingValue}
						min={range.min}
						max={range.max}
						step={range.step}
						onChange={handleChange}
					/>
				);
			case 'textarea':
				return (
					<textarea
						className={cx('text-area', 'form-field', className)}
						placeholder={hideLabel ? label : ''}
						name={name}
						id={name}
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
			{!isEditable && <span className={cx(type, className, 'form-field-static')}>{workingValue}</span>}
		</div>
	)
};