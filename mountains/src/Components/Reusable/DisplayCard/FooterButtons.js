import cx from 'classnames'

export const FooterButtons = ({ className, children }) => {
	return <div className={cx(className, 'action-buttons flex-box full-width')}>{children}</div>
}

export default FooterButtons
