import React from 'react'
import './styles.css'
import IconLogo from '../../Images/Logos/SundayLogos/SP_Favicon.png'
import Hamburger from 'Images/UIGlyphs/Hamburger'

const Header = ({ setNavOpen }) => {
	return (
		<div className='marketing-header'>
			<button
				onClick={() => setNavOpen(true)}
				className='marketing-button header-button'
			>
				<Hamburger />
			</button>
			<img
				src={IconLogo}
				className='header-sp-logo'
			/>
		</div>
	)
}

export default Header
