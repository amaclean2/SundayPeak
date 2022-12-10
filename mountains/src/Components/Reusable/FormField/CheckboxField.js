import PropTypes from 'prop-types'
import cx from 'classnames'

const CheckboxField = ({ className, name, value, onChange, label }) => {
	const handleChange = (e) => {
		onChange({
			target: {
				value: e.target.checked,
				name
			}
		})
	}

	return (
		<label className={cx('checkbox', className, 'label-field')}>
			<input
				className={'hidden-checkbox'}
				type='checkbox'
				id={name}
				name={name}
				checked={value}
				onChange={handleChange}
			/>
			<div className='checkbox-illus' />
			{label}
		</label>
	)
}

CheckboxField.propTypes = {
	className: PropTypes.string,
	name: PropTypes.string,
	value: PropTypes.bool,
	onChange: PropTypes.func,
	label: PropTypes.string
}

export default CheckboxField
