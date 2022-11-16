import cx from 'classnames'
import PropTypes from 'prop-types'

import { FormField } from '.'

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

MultiField.propTypes = {
	onChange: PropTypes.func,
	label: PropTypes.string,
	fields: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			name: PropTypes.string,
			placeholder: PropTypes.string
		})
	),
	className: PropTypes.string
}

export default MultiField
