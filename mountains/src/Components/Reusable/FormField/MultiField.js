import { FormField } from '.'
import cx from 'classnames'

const MultiField = ({ onChange, label, fields, className }) => {
	return (
		<div className={cx('multi-field flex-box', className)}>
			{label && <label className={'label-field'}>{label}</label>}
			<div className='multi-field-box flex-box'>
				{fields.map((field, key) => (
					<FormField
						key={`multi_field_${key}`}
						onChange={onChange}
						value={field.value}
						name={field.name}
						hideLabel
						isEditable
						placeholder={field.placeholder || ''}
					/>
				))}
			</div>
		</div>
	)
}

export default MultiField
