import { useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { CSVLink } from 'react-csv'
import { useAdventureStateContext } from 'sundaypeak-treewells'

import { Meatball } from 'Images/UIGlyphs/Meatball'
import { Button } from '../Button'
import { formatAdventureForExport } from './utils'

import './styles.css'

const Field = ({ field, onClick }) => {
	const { currentAdventure } = useAdventureStateContext()

	if (field.action === 'export') {
		return (
			<CSVLink
				data={[formatAdventureForExport(currentAdventure)]}
				filename={`${currentAdventure.adventure_name.replace(/ /g, '')}_data_export.csv`}
				className={cx('menu-button button flex-box', field.className)}
			>
				{field.text}
			</CSVLink>
		)
	} else {
		return (
			<Button
				className={cx('menu-button', field.className)}
				id={field.id || field.text.replaceAll(' ', '-').toLowerCase()}
				disabled={field.disabled}
				onClick={onClick}
			>
				{field.text}
			</Button>
		)
	}
}

export const Menu = ({ className, fields }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [position, setPosition] = useState('left')
	const menuRef = useRef()

	const handleMenuButton = (event, action) => {
		setIsOpen(false)
		action()
	}

	// this useEffect needs to be here because it needs to wait for the DOM to be loaded
	useEffect(() => {
		const position = menuRef.current.getBoundingClientRect().x
		const menuWidth = 200

		setPosition(position < menuWidth ? 'right' : 'left')
	}, [isOpen])

	return (
		<div
			ref={menuRef}
			className={cx('menu', className, position)}
		>
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
					<Field
						field={field}
						key={`menu_button_${key}`}
						onClick={(e) => handleMenuButton(e, field.action)}
					/>
				))}
			</div>
		</div>
	)
}

export const FieldProps = PropTypes.arrayOf(
	PropTypes.shape({
		className: PropTypes.string,
		id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		text: PropTypes.string.isRequired,
		action: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired
	})
)

const MenuFieldProps = {
	fields: FieldProps
}

Menu.propTypes = {
	...MenuFieldProps,
	className: PropTypes.string
}
