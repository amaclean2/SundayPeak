import cx from 'classnames'

import './styles.css'

export const FieldPage = ({ children, className }) => (
	<div className={cx(className, 'field-page flex-box')}>{children}</div>
)

export const FieldRow = ({ children, className, borderBottom }) => (
	<div className={cx(className, borderBottom && 'border-bottom', 'field-row flex-box')}>
		{children}
	</div>
)

export const Field = ({ children, className, borderRight, onClick, noPadding }) => (
	<div
		className={cx(className, borderRight && 'border-right', 'field flex-box')}
		style={noPadding && { padding: '0' }}
		onClick={onClick}
	>
		{children}
	</div>
)

export const FieldImage = ({ src, className }) => (
	<div className={cx(className, 'field-image flex-box')}>
		<img
			src={src}
			alt={''}
		/>
	</div>
)

export const FieldHeader = ({ text, children, className, onClick = () => {} }) => (
	<h3
		onClick={onClick}
		className={cx(className, 'field-header flex-box')}
	>
		{text || children}
	</h3>
)

export const FieldValue = ({ children, className }) => (
	<span className={cx('field-value', className)}>{children}</span>
)
