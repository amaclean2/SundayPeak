import React from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'

import './styles.css'
import { Link } from 'react-router-dom'

export const Button = ({
	onClick = () => {},
	className,
	children,
	disabled,
	id = 'basic-button',
	secondaryButton = false,
	headerButton = false,
	small = false,
	direction,
	type = 'button'
}) => {
	const handleClick = (e) => {
		console.log(`button ${id} clicked`)
		onClick(e)
	}

	if (type === 'link' || direction !== undefined) {
		return (
			<Link
				to={direction}
				onClick={onClick}
				id={id}
				data-testid={id}
				className={cx(
					'button flex-box link',
					className,
					secondaryButton && 'secondary-button',
					headerButton && 'header-button',
					small && 'small'
				)}
			>
				{children}
			</Link>
		)
	}

	return (
		<button
			id={id}
			data-testid={id}
			disabled={disabled}
			onClick={handleClick}
			className={cx(
				'button',
				'flex-box',
				className,
				secondaryButton && 'secondary-button',
				headerButton && 'header-button',
				small && 'small'
			)}
		>
			{children}
		</button>
	)
}

Button.propTypes = {
	onClick: PropTypes.func,
	className: PropTypes.string,
	children: PropTypes.node,
	disabled: PropTypes.bool,
	id: PropTypes.string,
	secondaryButton: PropTypes.bool,
	headerButton: PropTypes.bool,
	small: PropTypes.bool,
	direction: PropTypes.string,
	type: PropTypes.oneOf(['link', 'button'])
}
