import cx from 'classnames'

const NoEditField = ({ className, value }) => {
	return <div className={cx('form-field', className)}>{value}</div>
}

export default NoEditField
