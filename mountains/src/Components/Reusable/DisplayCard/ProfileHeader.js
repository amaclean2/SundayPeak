import cx from 'classnames'

import { FormField } from '../FormField'
import { Field, FieldImage } from '../FieldOrganizer'

export const HeaderSubtext = ({ children }) => <span className='header-subtext'>{children}</span>

export const ProfileHeader = ({
	textContents,
	configuration = 'left',
	editFields: { isEditable, propName, onChange, placeholder } = {},
	children,
	image = false,
	className,
	slim,
	locked
}) => {
	const renderEditHeader = () => (
		<FormField
			value={textContents}
			hideLabel
			name={propName}
			className='card-header'
			isEditable={isEditable}
			placeholder={placeholder}
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
				slim && 'slim',
				className,
				image && 'image-header',
				locked && 'header-locked'
			)}
		>
			{isEditable && renderEditHeader()}
			{!isEditable && image && renderImageHeader()}
			{!isEditable && !image && <Field>{children}</Field>}
		</div>
	)
}
