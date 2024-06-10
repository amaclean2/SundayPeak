import PropTypes from 'prop-types'
import cx from 'classnames'

import DisplayHeader from './DisplayHeader'
import { FieldProps, Menu } from '../Menu'

import './styles.css'
import { useRef } from 'react'

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
					bounds={{
						top: displayCardRef.current?.getBoundingClientRect()?.top ?? 0,
						right: displayCardRef.current?.getBoundingClientRect()?.right ?? 0
					}}
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
				<div className='display-content'>{children}</div>
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
