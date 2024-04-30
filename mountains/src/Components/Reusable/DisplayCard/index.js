import PropTypes from 'prop-types'
import cx from 'classnames'

import DisplayHeader from './DisplayHeader'
import { FieldProps, Menu } from '../Menu'

import './styles.css'
import { useEffect, useRef, useState } from 'react'

export const DisplayCard = ({
	children,
	onClose,
	configuration = 'left',
	className,
	title,
	menu,
	id,
	hasClose = true,
	blockBackground = false
}) => {
	const displayCardRef = useRef(null)
	const [frameBounds, setFrameBounds] = useState({ top: 0, right: 0 })

	useEffect(() => {
		const boundingBox = displayCardRef.current.getBoundingClientRect()
		setFrameBounds({ top: boundingBox.y, right: boundingBox.width + boundingBox.x })
	}, [displayCardRef.current])

	return (
		<div
			className={cx(
				'display-card-container flex-box',
				configuration,
				blockBackground && 'block-background'
			)}
			data-testid={id}
			id={id}
			onClick={() => blockBackground && onClose()}
		>
			{menu && (
				<Menu
					fields={menu.fields}
					bounds={frameBounds}
				/>
			)}
			<div
				className={cx('display-card', className)}
				ref={displayCardRef}
			>
				{title && (
					<DisplayHeader
						title={title}
						onClose={onClose}
						menu={!!menu}
						hasClose={hasClose}
					/>
				)}
				<div className='display-content flex-box'>{children}</div>
			</div>
		</div>
	)
}

DisplayCard.propTypes = {
	children: PropTypes.node,
	onClose: PropTypes.func,
	configuration: PropTypes.oneOf(['left', 'right', 'center']),
	className: PropTypes.string,
	title: PropTypes.node,
	menu: PropTypes.shape({
		fields: FieldProps
	}),
	hasClose: PropTypes.bool
}
