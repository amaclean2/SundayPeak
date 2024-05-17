import cx from 'classnames'

export const FooterButtons = ({ className, children, row }) => {
	return (
		<div className={cx(className, row && 'row', 'action-buttons flex-box full-width')}>
			{children}
		</div>
	)
}

export default FooterButtons
