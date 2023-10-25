import React from 'react'
import { Link } from 'react-router-dom'

import MainLogo from '../../Images/Logos/SundayLogos/SundayLogo.png'
import './styles.css'

const HomePage = () => {
	return (
		<div className={'first-page'}>
			<img
				src={MainLogo}
				className='marketing-main-logo'
			/>
			<h2 className='hero-text'>
				Find an adventure.
				<br />
				Find a friend.
				<br />
				Play outside.
				<br />
				Repeat.
			</h2>
			<Link
				to='/signup'
				className={'marketing-button hero-button'}
			>
				Sign Up
			</Link>
		</div>
	)
}

export default HomePage
