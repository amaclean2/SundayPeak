import PropTypes from 'prop-types'
import cx from 'classnames'
import { CheckboxChecked, CheckboxEmpty } from 'Images'

const CheckboxField = ({ className, name, value, onChange, label, testId, reverse = false }) => {
	const handleChange = (e) => {
		onChange({
			target: {
				value: e.target.checked,
				name
			}
		})
	}

	return (
		<label
			className={cx('checkbox', className, 'label-field flex-box')}
			data-testid={testId}
		>
			{reverse && label}
			<input
				className={'hidden-checkbox'}
				type='checkbox'
				name={name}
				checked={value}
				onChange={handleChange}
			/>
			{value === true ? <CheckboxChecked /> : <CheckboxEmpty />}
			{!reverse && label}
		</label>
	)
}

CheckboxField.propTypes = {
	className: PropTypes.string,
	name: PropTypes.string,
	value: PropTypes.bool,
	onChange: PropTypes.func,
	label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
	reverse: PropTypes.bool
}

export default CheckboxField
