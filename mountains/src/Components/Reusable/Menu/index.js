import cx from 'classnames'
import { useState } from 'react'
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

export default Menu
