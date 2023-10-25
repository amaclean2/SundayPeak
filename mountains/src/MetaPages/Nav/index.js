import React from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'

import CloseIcon from 'Images/UIGlyphs/Close'

import './styles.css'

const Nav = ({ navOpen, setNavOpen }) => {
	return (
		<div className={cx('marketing-navigation-container', navOpen && 'marketing-nav-open')}>
			<div className='marketing-nav-header'>
				<button
					className={'marketing-button'}
					onClick={() => setNavOpen(false)}
				>
					<CloseIcon />
				</button>
			</div>
			<div className='marketing-nav-content'>
				<ul>
					<li>
						<Link
							to={'/about'}
							onClick={() => setNavOpen(false)}
						>
							Home
						</Link>
					</li>
					<li>
						<Link
							to={'/privacy'}
							onClick={() => setNavOpen(false)}
						>
							Privacy Policy
						</Link>
					</li>
					<li>
						<Link
							to={'/support'}
							onClick={() => setNavOpen(false)}
						>
							Support
						</Link>
					</li>
				</ul>
			</div>
		</div>
	)
}

export default Nav
