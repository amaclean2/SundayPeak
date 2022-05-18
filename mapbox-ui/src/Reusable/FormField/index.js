import { useState } from 'react';
import { useLineEditContext } from '../../Providers/lineEditProvider';

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
	onChange = () => {}
}) => {
	const [workingValue, setWorkingValue] = useState(value);

	const handleChange = (e) => {
		onChange(e);
		setWorkingValue(e.target.value);
	};

	return (
		<div className="form-field-container">
			{!hideLabel && <label htmlFor={name} className={`${type} ${className} label-field`}>{label}</label>}
			{isEditable && (
				<input
					className={`${type} ${className} form-field`}
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