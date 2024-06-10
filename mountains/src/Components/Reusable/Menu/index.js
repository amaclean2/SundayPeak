import cx from 'classnames'
import PropTypes from 'prop-types'
import { CSVLink } from 'react-csv'
import {
	useAdventureStateContext,
	useCardStateContext,
	useManipulateFlows
} from '@amaclean2/sundaypeak-treewells'

import { Meatball } from 'Images/UIGlyphs/Meatball'
import { Button } from '../Button'
import { formatAdventureForExport } from './utils'

import './styles.css'
import { useEffect, useState } from 'react'

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

export const MenuButton = () => {
	const { toggleMenuOpen } = useManipulateFlows()

	return (
		<Button
			onClick={() => toggleMenuOpen()}
			id='menu-opener'
			className={'menu-opener'}
		>
			<Meatball />
		</Button>
	)
}

export const Menu = ({ fields, bounds }) => {
	const { toggleMenuOpen } = useManipulateFlows()
	const { isMenuOpen } = useCardStateContext()

	const [menuLeftPosition, setMenuLeftPosition] = useState(bounds.right)

	const handleMenuButton = (action) => {
		toggleMenuOpen()
		action()
	}

	useEffect(() => {
		setMenuLeftPosition(isMenuOpen ? bounds.right : bounds.right - 300)
	}, [isMenuOpen])

	return (
		<div
			className={'menu-buttons'}
			style={{ left: menuLeftPosition, top: `calc(${bounds.top}px + 3rem)` }}
		>
			{fields.map((field, key) => (
				<Field
					field={field}
					key={`menu_button_${key}`}
					onClick={() => handleMenuButton(field.action)}
				/>
			))}
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
