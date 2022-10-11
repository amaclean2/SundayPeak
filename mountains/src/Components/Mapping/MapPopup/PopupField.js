import cx from 'classnames'

import { Field, FieldHeader, FieldValue } from '../../Reusable'

export const PopupField = ({ name, value, className }) => (
	<Field className={cx('popup-field', className)}>
		<FieldHeader>{name}</FieldHeader>
		<FieldValue>{value}</FieldValue>
	</Field>
)

export const DescriptionField = ({ children }) => (
	<div className='popup-description'>{children}</div>
)
