import React, { useState } from 'react';
import { useAdventureEditContext } from '../../Providers/adventureEditProvider';

import './styles.css';

const FormField = ({
	type = 'text',
	name = '',
	label = '',
	value = '',
	isEditable = false,
	className = '',
	hideLabel = false,
	autoComplete = 'off',
	fullWidth = false,
	onChange = () => { }
}) => {
	const [workingValue, setWorkingValue] = useState(value);

	const handleChange = (e) => {
		onChange(e);
		setWorkingValue(e.target.value);
	};

	return (
		<div className={`form-field-container ${(fullWidth) ? 'wide' : ''} ${(!isEditable) ? 'small' : ''}`}>
			{!hideLabel && <label htmlFor={name} className={`${type} ${className} label-field`}>{label}</label>}
			{isEditable && (
				<input
					className={`${type} form-field`}
					type={type}
					name={name}
					autoComplete={autoComplete}
					placeholder={label}
					value={workingValue}
					onChange={handleChange}
				/>
			)}
			{!isEditable && <span className={`${type} ${className} form-field-static`}>{workingValue}</span>}
		</div>
	)
};

export default FormField;