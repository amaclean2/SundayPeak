import cx from 'classnames'

import { FormField } from '../FormField'
import { Field, FieldImage } from '../FieldOrganizer'

export const HeaderSubtext = ({ children }) => <span className='header-subtext'>{children}</span>

export const ProfileHeader = ({
	textContents,
	configuration = 'left',
	editFields: { isEditable, propName, onChange } = {},
	children,
	image = false,
	className
}) => {
	const renderEditHeader = () => (
		<FormField
			value={textContents}
			hideLabel
			name={propName}
			className='card-header'
			isEditable={isEditable}
			onChange={onChange}
		/>
	)

	const renderImageHeader = () => (
		<>
			<FieldImage src={image} />
			<div className='header-contents flex-box'>{children}</div>
		</>
	)

	return (
		<div
			className={cx(
				'profile-header',
				'flex-box',
				configuration,
				className,
				image && 'image-header'
			)}
		>
			{isEditable && renderEditHeader()}
			{!isEditable && image && renderImageHeader()}
			{!isEditable && !image && <Field>{children}</Field>}
		</div>
	)
}
