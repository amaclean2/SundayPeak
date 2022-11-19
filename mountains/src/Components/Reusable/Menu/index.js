import { useState } from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'

import { Meatball } from '../../../Images/Meatball'
import { Button } from '../Button'

import './styles.css'

const Menu = ({ className, fields = [] }) => {
	const [isOpen, setIsOpen] = useState(false)

	const handleMenuButton = (event, action) => {
		setIsOpen(false)
		action()
	}

	return (
		<div className={cx('menu', className)}>
			<Button
				onClick={() => setIsOpen(!isOpen)}
				id='menu-opener'
				className={'menu-opener'}
			>
				<Meatball />
			</Button>
			<div
				className={cx('menu-buttons-background', isOpen ? '' : 'closed')}
				onClick={() => setIsOpen(false)}
			/>
			<div className={'menu-buttons'}>
				{fields.map((field, key) => (
					<Button
						key={`menu_button_${key}`}
						className={cx('menu-button', field.className)}
						id={field.id || field.text.replaceAll(' ', '-')}
						onClick={(e) => handleMenuButton(e, field.action)}
					>
						{field.text}
					</Button>
				))}
			</div>
		</div>
	)
}

Menu.propTypes = {
	fields: PropTypes.arrayOf(
		PropTypes.shape({
			className: PropTypes.string,
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			text: PropTypes.string,
			action: PropTypes.func
		})
	).isRequired,
	className: PropTypes.string
}

export default Menu
